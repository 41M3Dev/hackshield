const express = require('express');
const router = express.Router();
const prisma = require('../../config/db');

router.get('/', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            status: 'ok',
            version: '1.0.0',
            environment: process.env.NODE_ENV,
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(503).json({
            success: false,
            status: 'degraded',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
