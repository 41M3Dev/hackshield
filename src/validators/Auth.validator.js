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

/**
 * Validator pour la vérification d'email
 * Utilisé par: POST /api/v1/auth/verify-email
 */
const verifyEmail = Joi.object({
    token: Joi.string()
        .required()
        .length(64) // crypto.randomBytes(32).toString('hex') = 64 chars
        .messages({ 'any.required': 'Le token de vérification est requis' })
}).messages(messages);

/**
 * Validator pour renvoyer l'email de vérification
 * Utilisé par: POST /api/v1/auth/resend-verification
 */
const resendVerification = Joi.object({
    email: fields.email.required()
}).messages(messages);

/**
 * Validator pour la demande de réinitialisation de mot de passe
 * Utilisé par: POST /api/v1/auth/forgot-password
 */
const forgotPassword = Joi.object({
    email: fields.email.required()
}).messages(messages);

/**
 * Validator pour la réinitialisation de mot de passe
 * Utilisé par: POST /api/v1/auth/reset-password
 */
const resetPassword = Joi.object({
    token: Joi.string()
        .required()
        .length(64)
        .messages({ 'any.required': 'Le token de réinitialisation est requis' }),
    newPassword: fields.password.required()
}).messages(messages);

/**
 * Validator pour le refresh token
 * Utilisé par: POST /api/v1/auth/refresh
 */
const refreshToken = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({ 'any.required': 'Le refresh token est requis' })
}).messages(messages);

/**
 * Validator pour le logout
 * Utilisé par: POST /api/v1/auth/logout
 */
const logout = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({ 'any.required': 'Le refresh token est requis' })
}).messages(messages);

/**
 * Validator pour activer le 2FA
 * Utilisé par: POST /api/v1/auth/2fa/enable
 */
const enableTwoFactor = Joi.object({
    phoneNumber: Joi.string()
        .required()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .messages({
            'any.required': 'Le numéro de téléphone est requis',
            'string.pattern.base': 'Numéro de téléphone invalide. Format requis: +33612345678'
        })
}).messages(messages);

/**
 * Validator pour vérifier le code 2FA (setup)
 * Utilisé par: POST /api/v1/auth/2fa/verify-setup
 */
const verifyTwoFactorSetup = Joi.object({
    code: Joi.string()
        .required()
        .length(6)
        .pattern(/^\d{6}$/)
        .messages({
            'any.required': 'Le code 2FA est requis',
            'string.length': 'Le code doit contenir 6 chiffres',
            'string.pattern.base': 'Le code doit être composé uniquement de chiffres'
        })
}).messages(messages);

/**
 * Validator pour vérifier le code 2FA (login)
 * Utilisé par: POST /api/v1/auth/2fa/verify-login
 */
const verifyTwoFactorLogin = Joi.object({
    userId: Joi.string()
        .required()
        .messages({ 'any.required': 'L\'ID utilisateur est requis' }),
    code: Joi.string()
        .required()
        .length(6)
        .pattern(/^\d{6}$/)
        .messages({
            'any.required': 'Le code 2FA est requis',
            'string.length': 'Le code doit contenir 6 chiffres',
            'string.pattern.base': 'Le code doit être composé uniquement de chiffres'
        })
}).messages(messages);

/**
 * Validator pour désactiver le 2FA
 * Utilisé par: POST /api/v1/auth/2fa/disable
 */
const disableTwoFactor = Joi.object({
    password: Joi.string()
        .required()
        .messages({ 'any.required': 'Le mot de passe est requis pour désactiver le 2FA' })
}).messages(messages);

module.exports = {
    register,              // Inscription publique (role/plan par défaut)
    login,                 // Connexion (email ou username)
    verifyEmail,           // Vérification d'email
    resendVerification,    // Renvoyer l'email de vérification
    forgotPassword,        // Demande de réinitialisation
    resetPassword,         // Réinitialisation du mot de passe
    refreshToken,          // Refresh du token
    logout,                // Déconnexion
    enableTwoFactor,       // Activer 2FA
    verifyTwoFactorSetup,  // Vérifier code 2FA (setup)
    verifyTwoFactorLogin,  // Vérifier code 2FA (login)
    disableTwoFactor       // Désactiver 2FA
};