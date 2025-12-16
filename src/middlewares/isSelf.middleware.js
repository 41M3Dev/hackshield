module.exports = (req, res, next) => {
    if (req.user.uuid !== req.params.uuid) {
        return res.status(403).json({ message: 'Accès interdit' });
    }
    next();
};
