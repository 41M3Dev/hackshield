const Joi = require('joi');

const patterns = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/,
    username: /^[a-zA-Z0-9_-]{3,30}$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

const messages = {
    'string.empty': '{{#label}} ne peut pas être vide',
    'string.email': '{{#label}} doit être une adresse email valide',
    'string.min': '{{#label}} doit contenir au moins {{#limit}} caractères',
    'string.max': '{{#label}} doit contenir au maximum {{#limit}} caractères',
    'string.pattern.base': 'Le format de {{#label}} est invalide',
    'any.required': '{{#label}} est requis',
    'any.only': '{{#label}} doit être parmi {{#valids}}'
};

const fields = {
    uuid: Joi.string()
        .pattern(patterns.uuid)
        .messages({ 'string.pattern.base': 'Format UUID invalide' }),

    username: Joi.string()
        .pattern(patterns.username)
        .min(3)
        .max(30)
        .messages({
            'string.pattern.base': "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .max(255),

    password: Joi.string()
        .pattern(patterns.password)
        .messages({
            'string.pattern.base': 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)'
        }),

    firstName: Joi.string().trim().min(1).max(50),
    lastName: Joi.string().trim().min(1).max(50),
    company: Joi.string().trim().min(1).max(100),
    role: Joi.string().valid('user', 'admin'),
    plan: Joi.string().valid('free', 'starter', 'pro', 'enterprise'),
    isActive: Joi.boolean(),
    rateLimit: Joi.number().integer().min(10).max(100000),
    apiKeyScopes: Joi.array()
        .items(Joi.string().valid('scan:create', 'scan:read', 'scan:delete', 'admin'))
        .unique()
        .max(4)
};

module.exports = { patterns, messages, fields };