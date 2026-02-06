const crypto = require('crypto');

/**
 * Génère une API Key sécurisée
 * Format: hlab_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (36 caractères)
 */
exports.generateApiKey = () => {
    const randomBytes = crypto.randomBytes(24).toString('hex');
    return `hlab_${randomBytes}`;
};

/**
 * Génère un token aléatoire hexadécimal
 * @param {number} length - Nombre d'octets (le résultat sera 2x plus long en hex)
 */
exports.generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Génère un code numérique à N chiffres (pour 2FA, OTP, etc.)
 * @param {number} digits - Nombre de chiffres
 */
exports.generateNumericCode = (digits = 6) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};
