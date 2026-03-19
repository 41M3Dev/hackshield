require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
// Prisma remplace Mongoose pour la connexion à PostgreSQL
const prisma = require('./config/db');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./config/logger');

const app = express();

// CORS — whitelist via variable d'environnement
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origine (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin non autorisée par CORS: ${origin}`));
    },
    credentials: true
}));
app.use('/api', apiLimiter);

// Logging HTTP via morgan — stream vers winston
app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) }
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur HackShield API',
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
app.use(errorMiddleware);

// Démarrage du serveur avec connexion Prisma
const PORT = process.env.PORT || 9001;

async function start() {
    await prisma.$connect();
    logger.info('Connecté à PostgreSQL via Prisma');

    app.listen(PORT, () => {
        logger.info(`HackShield API démarrée | port=${PORT} | env=${process.env.NODE_ENV || 'development'}`);
    });
}

start().catch((err) => {
    logger.error('Erreur au démarrage', { stack: err.stack });
    process.exit(1);
});

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', { stack: err?.stack });
    prisma.$disconnect().finally(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { stack: err.stack });
    prisma.$disconnect().finally(() => process.exit(1));
});

// Arrêt propre (SIGINT / SIGTERM)
process.on('SIGINT', async () => {
    logger.info('Arrêt en cours (SIGINT)...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Arrêt en cours (SIGTERM)...');
    await prisma.$disconnect();
    process.exit(0);
});
