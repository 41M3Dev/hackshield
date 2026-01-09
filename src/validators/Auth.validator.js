const Joi = require('joi');
const { fields, messages } = require('./Common.validator');

/**
 * Validator pour l'inscription publique (route non authentifiée)
 *
 * Différences avec createUserValidator (User.validator.js):
 * - Route PUBLIQUE vs route ADMIN
 * - PAS de champ role/plan/isActive (définis par défaut à 'user' et 'free')
 * - Tout nouvel utilisateur commence avec des permissions de base
 *
 * Utilisé par: POST /api/v1/auth/register
 */
const register = Joi.object({
    username: fields.username.required(),
    email: fields.email.required(),
    password: fields.password.required(),
    firstName: fields.firstName.optional(),
    lastName: fields.lastName.optional(),
    company: fields.company.optional()
}).messages(messages);

/**
 * Validator pour la connexion (route non authentifiée)
 *
 * Accepte email OU username dans le champ 'login' pour plus de flexibilité UX
 * Le mot de passe n'est PAS validé avec le pattern complexe ici (sera comparé avec bcrypt)
 *
 * Utilisé par: POST /api/v1/auth/login
 */
const login = Joi.object({
    login: Joi.string()
        .required()
        .messages({ 'any.required': "L'email ou le nom d'utilisateur est requis" }),
    password: Joi.string().required()
}).messages(messages);

module.exports = {
    register,  // Inscription publique (role/plan par défaut)
    login      // Connexion (email ou username)
};