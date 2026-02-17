require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
// Prisma remplace Mongoose pour la connexion à PostgreSQL
const prisma = require('./config/db');

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

    // Erreur de validation Prisma (contrainte unique violée)
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'champ';
        return res.status(409).json({
            success: false,
            error: `Ce ${field} existe déjà`
        });
    }

    // Erreur Prisma : enregistrement non trouvé
    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            error: 'Ressource non trouvée'
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

    // Erreur par défaut
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Erreur serveur'
            : err.message
    });
});

// Démarrage du serveur avec connexion Prisma
const PORT = process.env.PORT || 9001;

async function start() {
    // Vérifier la connexion à PostgreSQL via Prisma
    await prisma.$connect();
    console.log('✅ Connecté à PostgreSQL via Prisma');

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
}

start().catch((err) => {
    console.error('Erreur au démarrage:', err);
    process.exit(1);
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Déconnexion propre de Prisma avant arrêt
    prisma.$disconnect().finally(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Déconnexion propre de Prisma avant arrêt
    prisma.$disconnect().finally(() => process.exit(1));
});

// Arrêt propre (SIGINT / SIGTERM)
process.on('SIGINT', async () => {
    console.log('\n🔌 Arrêt en cours...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔌 Arrêt en cours...');
    await prisma.$disconnect();
    process.exit(0);
});
