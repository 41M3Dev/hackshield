const User = require('../models/user.model');

/**
 * Create user (admin or register)
 */
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username
        });

        const data = user.toObject();
        delete data.password;

        res.status(201).json({ success: true, data });
    } catch (error) {
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
