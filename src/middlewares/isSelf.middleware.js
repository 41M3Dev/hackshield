/**
 * Middleware qui vérifie si l'utilisateur accède à ses propres ressources
 * Simplifié pour Prisma : l'id est toujours un UUID string, plus besoin de mongoose.isValidObjectId
 */
module.exports = (req, res, next) => {
    try {
        const paramId = req.params.uuid || req.params.id;

        if (!paramId) {
            return res.status(400).json({ message: 'Paramètre utilisateur manquant' });
        }

        // Comparaison directe par UUID string (plus besoin de ObjectId)
        const isAuthorized = req.user.id === paramId;

        if (!isAuthorized) {
            console.warn(`Access denied for user ${req.user.id} on ${paramId}`);
            return res.status(403).json({ message: 'Accès interdit' });
        }

        next();
    } catch (err) {
        console.error('Erreur isSelf middleware:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
