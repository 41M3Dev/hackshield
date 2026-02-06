const mongoose = require('mongoose');

/**
 * Middleware qui vérifie si l'utilisateur accède à ses propres ressources
 * Supporte la comparaison par UUID ou par ObjectId MongoDB
 */
module.exports = (req, res, next) => {
    try {
        // Supporte uuid ou id
        const paramId = req.params.uuid || req.params.id;

        if (!paramId) {
            return res.status(400).json({ message: 'Paramètre utilisateur manquant' });
        }

        // Vérifier si c'est un ObjectId MongoDB
        const isObjectId = mongoose.isValidObjectId(paramId);

        // Comparer avec l'ID approprié du token JWT
        let isAuthorized = false;

        if (isObjectId && req.user.id) {
            // Comparaison par ObjectId MongoDB
            isAuthorized = req.user.id.toString() === paramId.toString();
        }

        if (!isAuthorized && req.user.uuid) {
            // Comparaison par UUID
            isAuthorized = req.user.uuid === paramId;
        }

        if (!isAuthorized) {
            console.warn(`Access denied for user ${req.user.uuid || req.user.id} on ${paramId}`);
            return res.status(403).json({ message: 'Accès interdit' });
        }

        next();
    } catch (err) {
        console.error('Erreur isSelf middleware:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

