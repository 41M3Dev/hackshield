require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur HackLab API',
        version: '1.0.0',
        documentation: '/api/v1'
    });
});

// Routes API v1
app.use('/api/v1', require('./routes/v1'));

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée',
        path: req.path
    });
});

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
    console.error('Erreur:', err);

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Erreur de validation',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Erreur de duplication (clé unique)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            error: `Ce ${field} existe déjà`
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

    // Erreur CastError (ID MongoDB invalide)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'ID invalide'
        });
    }

    // Erreur par défaut
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Erreur serveur'
            : err.message
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║     HackLab API - Serveur lancé      ║
╠═══════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(30)} ║
║  Env:  ${(process.env.NODE_ENV || 'development').padEnd(30)} ║
║  URL:  http://localhost:${PORT.toString().padEnd(19)} ║
╚═══════════════════════════════════════╝
    `);
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
