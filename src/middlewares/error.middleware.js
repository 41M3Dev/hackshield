const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
    logger.error(err.message, { stack: err.stack, code: err.code });

    // Erreur de validation Prisma (contrainte unique violée)
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'champ';
        return res.status(409).json({
            success: false,
            error: `Ce ${field} existe déjà`
        });
    }

    // Erreur Prisma : enregistrement non trouvé
    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            error: 'Ressource non trouvée'
        });
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Token invalide'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expiré'
        });
    }

    // Erreur par défaut
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Erreur serveur'
            : err.message
    });
};
