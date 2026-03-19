const rateLimit = require('express-rate-limit');

// Limite générale pour toutes les routes API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});

// Limite stricte pour les routes d'authentification sensibles (login, register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Trop de tentatives, réessayez dans 15 minutes.' }
});

// Limite très stricte pour mot de passe oublié et reset (anti-spam)
const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Trop de demandes de réinitialisation, réessayez dans 1 heure.' }
});

module.exports = { apiLimiter, authLimiter, passwordLimiter };
