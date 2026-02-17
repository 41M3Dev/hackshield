// Prisma remplace Mongoose — toutes les opérations DB utilisent prisma client
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/email.service');

/**
 * Supprime tous les champs sensibles avant d'envoyer l'utilisateur en réponse.
 * À utiliser dans TOUTES les réponses qui retournent un objet user.
 */
const sanitizeUser = (user) => {
    const {
        password,
        emailVerificationToken,
        emailVerificationExpires,
        resetPasswordToken,
        resetPasswordExpires,
        twoFactorCode,
        twoFactorExpires,
        loginAttempts,
        lockUntil,
        ...data
    } = user;
    return data;
};

/**
 * Register a new user (public route)
 */
exports.register = async (req, res, next) => {
    try {
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                company: req.body.company,
                emailVerificationToken,
                emailVerificationExpires
            }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id }
        });

        try {
            await sendVerificationEmail(user.email, emailVerificationToken);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
        }

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            data: sanitizeUser(user),
            message: 'Inscription réussie. Veuillez vérifier votre email.'
        });
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            return res.status(409).json({
                success: false,
                message: `${field === 'email' ? 'Cet email' : 'Ce nom d\'utilisateur'} est déjà utilisé`
            });
        }
        next(error);
    }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
                isDeleted: false
            }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }

        const isLocked = !!(user.lockUntil && user.lockUntil > new Date());
        if (isLocked) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                success: false,
                message: `Compte verrouillé. Réessayez dans ${remainingTime} minute(s).`,
                lockUntil: user.lockUntil
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Compte désactivé' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const maxAttempts = 5;
            const lockTime = 15 * 60 * 1000;
            const newAttempts = user.loginAttempts + 1;

            const updateData = { loginAttempts: newAttempts };
            if (newAttempts >= maxAttempts) {
                updateData.lockUntil = new Date(Date.now() + lockTime);
            }

            await prisma.user.update({ where: { id: user.id }, data: updateData });

            if (newAttempts >= maxAttempts) {
                return res.status(423).json({
                    success: false,
                    message: 'Trop de tentatives échouées. Compte verrouillé pendant 15 minutes.',
                    lockUntil: updateData.lockUntil
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects',
                attemptsLeft: maxAttempts - newAttempts
            });
        }

        if (user.twoFactorEnabled) {
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
            const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.user.update({
                where: { id: user.id },
                data: { twoFactorCode, twoFactorExpires, twoFactorVerified: false }
            });

            const { sendTwoFactorCode } = require('../services/sms.service');
            try {
                await sendTwoFactorCode(user.phoneNumber, twoFactorCode);
            } catch (smsError) {
                console.error('Erreur envoi SMS:', smsError);
                return res.status(500).json({ success: false, message: 'Impossible d\'envoyer le code 2FA' });
            }

            return res.status(200).json({
                success: true,
                requiresTwoFactor: true,
                message: 'Code 2FA envoyé par SMS',
                userId: user.id
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: 0, lockUntil: null, lastLogin: new Date() }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id }
        });

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data: sanitizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 */
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token requis' });
    }

    try {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        return res.json({ message: 'Déconnexion réussie' });
    } catch (err) {
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Refresh token
 */
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token requis' });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken || storedToken.userId !== payload.id) {
            return res.status(403).json({ message: 'Refresh token invalide' });
        }

        const accessToken = generateAccessToken(storedToken.user);
        return res.json({ accessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Refresh token expiré ou invalide' });
    }
};

/**
 * Verify email with token
 */
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token de vérification requis' });
        }

        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null
            }
        });

        res.status(200).json({ success: true, message: 'Email vérifié avec succès' });
    } catch (error) {
        next(error);
    }
};

/**
 * Resend verification email
 */
exports.resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ success: false, message: 'Email déjà vérifié' });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken, emailVerificationExpires }
        });

        await sendVerificationEmail(user.email, emailVerificationToken);

        res.status(200).json({ success: true, message: 'Email de vérification renvoyé' });
    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
            });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken, resetPasswordExpires }
        });

        await sendPasswordResetEmail(user.email, resetPasswordToken);

        res.status(200).json({
            success: true,
            message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token et nouveau mot de passe requis' });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }
        });

        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

        try {
            await sendPasswordChangedEmail(user.email);
        } catch (emailError) {
            console.error('Erreur envoi email confirmation:', emailError);
        }

        res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        next(error);
    }
};

/**
 * Enable 2FA for user (requires authentication)
 */
exports.enableTwoFactor = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const userId = req.user.id;

        const { validatePhoneNumber, sendTwoFactorCode } = require('../services/sms.service');

        if (!validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Numéro de téléphone invalide. Format requis: +33612345678'
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
        const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { id: userId },
            data: { phoneNumber, twoFactorCode, twoFactorExpires, twoFactorVerified: false }
        });

        await sendTwoFactorCode(phoneNumber, twoFactorCode);

        res.status(200).json({ success: true, message: 'Code de vérification envoyé par SMS' });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify 2FA code and enable 2FA
 */
exports.verifyTwoFactorSetup = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (!user.twoFactorCode || !user.twoFactorExpires) {
            return res.status(400).json({
                success: false,
                message: 'Aucun code en attente. Demandez d\'abord l\'activation du 2FA.'
            });
        }

        if (user.twoFactorExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'Code expiré. Demandez un nouveau code.' });
        }

        if (user.twoFactorCode !== code) {
            return res.status(401).json({ success: false, message: 'Code incorrect' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true, twoFactorVerified: true, twoFactorCode: null, twoFactorExpires: null }
        });

        res.status(200).json({ success: true, message: 'Authentification à deux facteurs activée avec succès' });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify 2FA code during login
 */
exports.verifyTwoFactorLogin = async (req, res, next) => {
    try {
        const { userId, code } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Session invalide' });
        }

        if (!user.twoFactorCode || !user.twoFactorExpires) {
            return res.status(400).json({ success: false, message: 'Aucun code en attente' });
        }

        if (user.twoFactorExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'Code expiré. Veuillez vous reconnecter.' });
        }

        if (user.twoFactorCode !== code) {
            return res.status(401).json({ success: false, message: 'Code incorrect' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                twoFactorCode: null,
                twoFactorExpires: null,
                twoFactorVerified: true,
                lastLogin: new Date(),
                loginAttempts: 0,
                lockUntil: null
            }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id }
        });

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data: sanitizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Disable 2FA (requires password confirmation)
 */
exports.disableTwoFactor = async (req, res, next) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: false,
                twoFactorVerified: false,
                twoFactorCode: null,
                twoFactorExpires: null,
                phoneNumber: null
            }
        });

        res.status(200).json({ success: true, message: 'Authentification à deux facteurs désactivée' });
    } catch (error) {
        next(error);
    }
};
