const User = require('../models/user.model');
const { generateApiKey } = require('../utils/generator');

/**
 * Create user (admin only)
 * Permet de définir role, plan, isActive contrairement à l'inscription publique
 */
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            company: req.body.company,
            // Champs admin uniquement
            role: req.body.role || 'user',
            plan: req.body.plan || 'free',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            emailVerified: true // Admin créé = email vérifié
        });

        const data = user.toObject();
        delete data.password;

        res.status(201).json({ success: true, data });
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
 * Get all users (admin only)
 */
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isDeleted: false }).select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get one user
 */
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user (me)
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id, isDeleted: false }).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid token or user deleted' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 */
exports.updateUser = async (req, res, next) => {
    try {
        const allowed = ['firstName', 'lastName', 'company'];
        const updates = {};

        // Champs autorisés
        allowed.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findOne({ _id: req.params.id, isDeleted: false });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ajouter le mot de passe si présent
        if (req.body.password) {
            user.password = req.body.password; // sera hashé automatiquement par pre('save')
        }

        // Appliquer les autres champs
        Object.assign(user, updates);

        await user.save(); // déclenche pre-save pour hash

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user (soft delete)
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found or already deleted' });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Update password (authenticated user)
 */
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findOne({
            _id: req.user.id,
            isDeleted: false
        }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier l'ancien mot de passe
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;

        // Invalider tous les refresh tokens sauf le courant (forcer reconnexion autres appareils)
        user.refreshTokens = [];

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès. Veuillez vous reconnecter sur vos autres appareils.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Generate or regenerate API Key
 */
exports.generateUserApiKey = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id,
            isDeleted: false
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Générer une nouvelle API Key
        const apiKey = generateApiKey();
        user.apiKey = apiKey;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'API Key générée avec succès',
            apiKey // Afficher une seule fois, ensuite elle sera masquée
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Revoke API Key
 */
exports.revokeApiKey = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user.id, isDeleted: false },
            { $unset: { apiKey: 1 } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'API Key révoquée avec succès'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout from all devices (invalidate all refresh tokens)
 */
exports.logoutAll = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user.id, isDeleted: false },
            { refreshTokens: [] },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Déconnecté de tous les appareils'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Update any user (full access)
 */
exports.adminUpdateUser = async (req, res, next) => {
    try {
        const allowed = [
            'firstName', 'lastName', 'company', 'email',
            'role', 'plan', 'isActive', 'rateLimit', 'apiKeyScopes'
        ];
        const updates = {};

        allowed.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
