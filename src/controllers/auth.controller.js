// Prisma remplace Mongoose — toutes les opérations DB utilisent prisma client
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/email.service');


/**
 * Register a new user (public route)
 */
exports.register = async (req, res, next) => {
    try {
        // Générer le token de vérification d'email
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Hash du mot de passe dans le controller (plus de pre-save hook Mongoose)
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

        // Générer les tokens JWT
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Sauvegarder le refresh token dans la table séparée RefreshToken (plus de tableau embarqué)
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        // Envoyer l'email de vérification
        try {
            await sendVerificationEmail(user.email, emailVerificationToken);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // On continue même si l'email ne part pas
        }

        // Exclure les champs sensibles de la réponse (plus de toObject/delete)
        const { password, emailVerificationToken: _token, ...data } = user;

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            data,
            message: 'Inscription réussie. Veuillez vérifier votre email.'
        });
    } catch (error) {
        // Erreur de contrainte unique Prisma (remplace error.code === 11000)
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

        // findFirst avec OR pour email/username (remplace $or Mongoose)
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: login }, { username: login }],
                isDeleted: false
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Vérifier si le compte est verrouillé (remplace le virtual isLocked)
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
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé'
            });
        }

        // Comparaison bcrypt directe (plus de méthode Mongoose comparePassword)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Brute force protection : incrémenter les tentatives si mot de passe incorrect
        if (!isPasswordValid) {
            const maxAttempts = 5;
            const lockTime = 15 * 60 * 1000; // 15 minutes
            const newAttempts = user.loginAttempts + 1;

            // Prisma update remplace user.incrementLoginAttempts()
            const updateData = { loginAttempts: newAttempts };
            if (newAttempts >= maxAttempts) {
                updateData.lockUntil = new Date(Date.now() + lockTime);
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData
            });

            if (newAttempts >= maxAttempts) {
                return res.status(423).json({
                    success: false,
                    message: 'Trop de tentatives échouées. Compte verrouillé pendant 15 minutes.',
                    lockUntil: updateData.lockUntil
                });
            }

            const attemptsLeft = maxAttempts - newAttempts;
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects',
                attemptsLeft: attemptsLeft > 0 ? attemptsLeft : 0
            });
        }

        // 2FA: Si activé, envoyer le code et attendre la vérification
        if (user.twoFactorEnabled) {
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
            const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Prisma update remplace user.save() avec champs modifiés
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    twoFactorCode,
                    twoFactorExpires,
                    twoFactorVerified: false
                }
            });

            const { sendTwoFactorCode } = require('../services/sms.service');
            try {
                await sendTwoFactorCode(user.phoneNumber, twoFactorCode);
            } catch (smsError) {
                console.error('Erreur envoi SMS:', smsError);
                return res.status(500).json({
                    success: false,
                    message: 'Impossible d\'envoyer le code 2FA'
                });
            }

            return res.status(200).json({
                success: true,
                requiresTwoFactor: true,
                message: 'Code 2FA envoyé par SMS',
                userId: user.id // UUID au lieu de _id
            });
        }

        // Réinitialiser les tentatives après un login réussi (remplace resetLoginAttempts)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockUntil: null,
                lastLogin: new Date()
            }
        });

        // Générer les tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Sauvegarder le refresh token dans la table séparée
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        // Exclure les champs sensibles
        const { password: _pwd, ...data } = user;

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data
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
        // Supprimer le refresh token de la table séparée (remplace $pull sur le tableau)
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

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
        // 1. Vérifier signature
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // 2. Vérifier présence en DB via la table RefreshToken (remplace findOne avec refreshTokens.token)
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken || storedToken.userId !== payload.id) {
            return res.status(403).json({ message: 'Refresh token invalide' });
        }

        // 3. Générer nouvel access token
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
            return res.status(400).json({
                success: false,
                message: 'Token de vérification requis'
            });
        }

        // findFirst avec filtre sur date (remplace $gt Mongoose)
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        // prisma.update remplace user.save() avec champs modifiés
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null
            }
        });

        res.status(200).json({
            success: true,
            message: 'Email vérifié avec succès'
        });
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

        const user = await prisma.user.findFirst({
            where: { email, isDeleted: false }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email déjà vérifié'
            });
        }

        // Générer un nouveau token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken,
                emailVerificationExpires
            }
        });

        await sendVerificationEmail(user.email, emailVerificationToken);

        res.status(200).json({
            success: true,
            message: 'Email de vérification renvoyé'
        });
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

        const user = await prisma.user.findFirst({
            where: { email, isDeleted: false }
        });

        // Pour des raisons de sécurité, on retourne toujours success même si l'utilisateur n'existe pas
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
            });
        }

        // Générer le token de reset
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken,
                resetPasswordExpires
            }
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
            return res.status(400).json({
                success: false,
                message: 'Token et nouveau mot de passe requis'
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        // Hash du mot de passe dans le controller (plus de pre-save hook)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe et invalider les tokens
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        // Invalider tous les refresh tokens (suppression dans la table séparée)
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });

        // Envoyer un email de confirmation
        try {
            await sendPasswordChangedEmail(user.email);
        } catch (emailError) {
            console.error('Erreur envoi email confirmation:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });
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
        const userId = req.user.id; // Doit être authentifié

        const { validatePhoneNumber, sendTwoFactorCode } = require('../services/sms.service');

        // Valider le format du numéro
        if (!validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Numéro de téléphone invalide. Format requis: +33612345678'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Générer un code de vérification
        const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
        const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);

        // prisma.update remplace user.save() avec champs modifiés
        await prisma.user.update({
            where: { id: userId },
            data: {
                phoneNumber,
                twoFactorCode,
                twoFactorExpires,
                twoFactorVerified: false
            }
        });

        // Envoyer le code
        await sendTwoFactorCode(phoneNumber, twoFactorCode);

        res.status(200).json({
            success: true,
            message: 'Code de vérification envoyé par SMS'
        });
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

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        if (!user.twoFactorCode || !user.twoFactorExpires) {
            return res.status(400).json({
                success: false,
                message: 'Aucun code en attente. Demandez d\'abord l\'activation du 2FA.'
            });
        }

        if (user.twoFactorExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Code expiré. Demandez un nouveau code.'
            });
        }

        if (user.twoFactorCode !== code) {
            return res.status(401).json({
                success: false,
                message: 'Code incorrect'
            });
        }

        // Activer le 2FA
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: true,
                twoFactorVerified: true,
                twoFactorCode: null,
                twoFactorExpires: null
            }
        });

        res.status(200).json({
            success: true,
            message: 'Authentification à deux facteurs activée avec succès'
        });
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

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session invalide'
            });
        }

        if (!user.twoFactorCode || !user.twoFactorExpires) {
            return res.status(400).json({
                success: false,
                message: 'Aucun code en attente'
            });
        }

        if (user.twoFactorExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Code expiré. Veuillez vous reconnecter.'
            });
        }

        if (user.twoFactorCode !== code) {
            return res.status(401).json({
                success: false,
                message: 'Code incorrect'
            });
        }

        // Code valide, compléter le login
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

        // Générer les tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Sauvegarder le refresh token dans la table séparée
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        // Exclure les champs sensibles
        const { password: _pwd, twoFactorCode: _code, ...data } = user;

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data
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

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier le mot de passe (bcrypt.compare direct, plus de méthode Mongoose)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe incorrect'
            });
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

        res.status(200).json({
            success: true,
            message: 'Authentification à deux facteurs désactivée'
        });
    } catch (error) {
        next(error);
    }
};
