// Prisma remplace Mongoose — toutes les opérations DB utilisent prisma client
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const { generateApiKey } = require('../utils/generator');

/**
 * Create user (admin only)
 * Permet de définir role, plan, isActive contrairement à l'inscription publique
 */
exports.createUser = async (req, res, next) => {
    try {
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
                // Champs admin uniquement — mapping des valeurs vers les enums Prisma
                role: (req.body.role || 'user').toUpperCase(),
                plan: (req.body.plan || 'free').toUpperCase(),
                isActive: req.body.isActive !== undefined ? req.body.isActive : true,
                emailVerified: true // Admin créé = email vérifié
            }
        });

        // Exclure le password de la réponse (remplace toObject/delete)
        const { password, ...data } = user;

        res.status(201).json({ success: true, data });
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
 * Get all users (admin only)
 */
exports.getUsers = async (req, res, next) => {
    try {
        // Prisma select pour exclure le password (remplace .select('-password'))
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            omit: { password: true }
        });

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
        // prisma.findUnique remplace findOne avec _id (on utilise req.params.id = UUID)
        const user = await prisma.user.findFirst({
            where: { id: req.params.id, isDeleted: false },
            omit: { password: true }
        });

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
        // req.user.id au lieu de req.user._id
        const user = await prisma.user.findFirst({
            where: { id: req.user.id, isDeleted: false },
            omit: { password: true }
        });

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

        const user = await prisma.user.findFirst({
            where: { id: req.params.id, isDeleted: false }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Si mot de passe présent, le hasher manuellement (plus de pre-save hook)
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }

        // prisma.update remplace Object.assign + save
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: updates,
            omit: { password: true }
        });

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user (soft delete)
 */
exports.deleteUser = async (req, res, next) => {
    try {
        // prisma.update remplace findOneAndUpdate pour le soft delete
        const user = await prisma.user.findFirst({
            where: { id: req.params.id, isDeleted: false }
        });

        if (!user) return res.status(404).json({ message: 'User not found or already deleted' });

        await prisma.user.update({
            where: { id: req.params.id },
            data: { isDeleted: true, deletedAt: new Date() }
        });

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

        // req.user.id au lieu de req.user._id
        const user = await prisma.user.findFirst({
            where: { id: req.user.id, isDeleted: false }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier l'ancien mot de passe (bcrypt.compare direct)
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Hash du nouveau mot de passe (plus de pre-save hook)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        // Invalider tous les refresh tokens (suppression dans la table séparée)
        await prisma.refreshToken.deleteMany({
            where: { userId: req.user.id }
        });

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
        const user = await prisma.user.findFirst({
            where: { id: req.user.id, isDeleted: false }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Générer une nouvelle API Key
        const apiKey = generateApiKey();

        // Supprimer les anciennes clés API de l'utilisateur puis créer la nouvelle
        await prisma.apiKey.deleteMany({
            where: { userId: req.user.id }
        });

        await prisma.apiKey.create({
            data: {
                key: apiKey,
                scopes: ['scan:create', 'scan:read'],
                userId: req.user.id
            }
        });

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
        const user = await prisma.user.findFirst({
            where: { id: req.user.id, isDeleted: false }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Supprimer toutes les clés API de l'utilisateur (remplace $unset)
        await prisma.apiKey.deleteMany({
            where: { userId: req.user.id }
        });

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
        const user = await prisma.user.findFirst({
            where: { id: req.user.id, isDeleted: false }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Supprimer tous les refresh tokens (remplace refreshTokens: [])
        await prisma.refreshToken.deleteMany({
            where: { userId: req.user.id }
        });

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
            'role', 'plan', 'isActive', 'rateLimit'
        ];
        const updates = {};

        allowed.forEach(field => {
            if (req.body[field] !== undefined) {
                // Convertir role et plan en majuscules pour les enums Prisma
                if (field === 'role' || field === 'plan') {
                    updates[field] = req.body[field].toUpperCase();
                } else {
                    updates[field] = req.body[field];
                }
            }
        });

        const existingUser = await prisma.user.findFirst({
            where: { id: req.params.id, isDeleted: false }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // prisma.update remplace findOneAndUpdate (avec omit password au lieu de select('-password'))
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: updates,
            omit: { password: true }
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
