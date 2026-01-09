const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    try {
        // Supporte uuid ou id
        const paramId = req.params.uuid || req.params.id;

        if (!paramId) {
            return res.status(400).json({ message: 'Paramètre utilisateur manquant' });
        }

        // Si paramId est un ObjectId, on le transforme en string pour comparer
        const userId = mongoose.isValidObjectId(paramId) ? paramId.toString() : paramId;

        if (req.user.uuid !== userId) {
            // Audit log (optionnel)
            console.warn(`Access denied for user ${req.user.uuid} on ${paramId}`);
            return res.status(403).json({ message: 'Accès interdit' });
        }

        next();
    } catch (err) {
        console.error('Erreur isSelf middleware:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

