const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};