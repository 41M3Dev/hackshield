const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT (export par défaut)
 */
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

// Export par défaut et named export pour compatibilité
module.exports = auth;
module.exports.authenticate = auth;
