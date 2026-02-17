const jwt = require('jsonwebtoken');

// Changement Prisma : on utilise user.id (UUID) au lieu de user._id (ObjectId)
exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
};

// Changement Prisma : on utilise user.id (UUID) au lieu de user.uuid
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};
