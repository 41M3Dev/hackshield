const User = require('../models/User.model');
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

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            company: req.body.company,
            emailVerificationToken,
            emailVerificationExpires
        });

        // Générer les tokens JWT
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Sauvegarder le refresh token en DB
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: new Date()
        });
        await user.save();

        // Envoyer l'email de vérification
        try {
            await sendVerificationEmail(user.email, emailVerificationToken);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // On continue même si l'email ne part pas
        }

        const data = user.toObject();
        delete data.password;
        delete data.emailVerificationToken;
        delete data.refreshTokens;

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            data,
            message: 'Inscription réussie. Veuillez vérifier votre email.'
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
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

        const user = await User.findOne({
            $or: [{ email: login }, { username: login }],
            isDeleted: false
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // ✅ BRUTE FORCE PROTECTION: Vérifier si le compte est verrouillé
        if (user.isLocked) {
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

        const isPasswordValid = await user.comparePassword(password);

        // ✅ BRUTE FORCE PROTECTION: Incrémenter les tentatives si mot de passe incorrect
        if (!isPasswordValid) {
            await user.incrementLoginAttempts();

            // Récupérer l'utilisateur mis à jour pour vérifier s'il vient d'être verrouillé
            const updatedUser = await User.findById(user._id);
            if (updatedUser.isLocked) {
                return res.status(423).json({
                    success: false,
                    message: 'Trop de tentatives échouées. Compte verrouillé pendant 15 minutes.',
                    lockUntil: updatedUser.lockUntil
                });
            }

            const attemptsLeft = 5 - updatedUser.loginAttempts;
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects',
                attemptsLeft: attemptsLeft > 0 ? attemptsLeft : 0
            });
        }

        // ✅ 2FA: Si activé, envoyer le code et attendre la vérification
        if (user.twoFactorEnabled) {
            // Générer un code 2FA à 6 chiffres
            const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
            const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            user.twoFactorCode = twoFactorCode;
            user.twoFactorExpires = twoFactorExpires;
            user.twoFactorVerified = false;
            await user.save();

            // Envoyer le code par SMS (service à implémenter)
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
                userId: user._id // Temporaire pour la vérification
            });
        }

        // ✅ BRUTE FORCE PROTECTION: Réinitialiser les tentatives après un login réussi
        await user.resetLoginAttempts();

        user.lastLogin = new Date();

        // Générer les tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Sauvegarder le refresh token
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: new Date()
        });

        await user.save();

        const data = user.toObject();
        delete data.password;
        delete data.refreshTokens;

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
        await User.updateOne(
            { 'refreshTokens.token': refreshToken },
            { $pull: { refreshTokens: { token: refreshToken } } }
        );

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
        // 1️⃣ Vérifier signature
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // 2️⃣ Vérifier présence en DB
        const user = await User.findOne({
            uuid: payload.uuid,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            return res.status(403).json({ message: 'Refresh token invalide' });
        }

        // 3️⃣ Générer nouvel access token
        const accessToken = generateAccessToken(user);

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

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

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

        const user = await User.findOne({ email, isDeleted: false });

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

        user.emailVerificationToken = emailVerificationToken;
        user.emailVerificationExpires = emailVerificationExpires;
        await user.save();

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

        const user = await User.findOne({ email, isDeleted: false });

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

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

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

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Invalider tous les refresh tokens existants pour forcer une reconnexion
        user.refreshTokens = [];

        await user.save();

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

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Générer un code de vérification
        const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
        const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.phoneNumber = phoneNumber;
        user.twoFactorCode = twoFactorCode;
        user.twoFactorExpires = twoFactorExpires;
        user.twoFactorVerified = false;
        await user.save();

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

        const user = await User.findById(userId).select('+twoFactorCode +twoFactorExpires');

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

        if (user.twoFactorExpires < Date.now()) {
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
        user.twoFactorEnabled = true;
        user.twoFactorVerified = true;
        user.twoFactorCode = undefined;
        user.twoFactorExpires = undefined;
        await user.save();

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

        const user = await User.findById(userId).select('+twoFactorCode +twoFactorExpires');

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

        if (user.twoFactorExpires < Date.now()) {
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
        user.twoFactorCode = undefined;
        user.twoFactorExpires = undefined;
        user.twoFactorVerified = true;
        user.lastLogin = new Date();

        // Réinitialiser les tentatives de login
        await user.resetLoginAttempts();

        // Générer les tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshTokens.push({
            token: refreshToken,
            createdAt: new Date()
        });

        await user.save();

        const data = user.toObject();
        delete data.password;
        delete data.refreshTokens;
        delete data.twoFactorCode;

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

        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier le mot de passe pour des raisons de sécurité
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe incorrect'
            });
        }

        user.twoFactorEnabled = false;
        user.twoFactorVerified = false;
        user.twoFactorCode = undefined;
        user.twoFactorExpires = undefined;
        user.phoneNumber = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Authentification à deux facteurs désactivée'
        });
    } catch (error) {
        next(error);
    }
};