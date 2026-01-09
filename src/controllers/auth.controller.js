const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../utils/token');


/**
 * Register a new user (public route)
 */
exports.register = async (req, res, next) => {
    try {
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            company: req.body.company
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const data = user.toObject();
        delete data.password;

        res.status(201).json({
            success: true,
            token,
            data
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

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const data = user.toObject();
        delete data.password;

        res.status(200).json({
            success: true,
            token,
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