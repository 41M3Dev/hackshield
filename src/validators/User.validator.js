const Joi = require('joi');
const { fields, messages } = require('./Common.validator');

/**
 * Validator pour la création d'utilisateur par un admin
 * Inclut des champs supplémentaires (role, plan, isActive) que l'inscription publique n'a pas
 */
const createUserValidator = Joi.object({
    username: fields.username.required(),
    email: fields.email.required(),
    password: fields.password.required(),
    firstName: fields.firstName,
    lastName: fields.lastName,
    company: fields.company,
    // Champs réservés aux admins
    role: fields.role,
    plan: fields.plan,
    isActive: fields.isActive
}).messages(messages);

/**
 * Validator pour la mise à jour du profil utilisateur
 * L'utilisateur peut modifier ses informations personnelles mais pas son role/plan
 */
const updateUserValidator = Joi.object({
    firstName: fields.firstName,
    lastName: fields.lastName,
    company: fields.company,
    email: fields.email
}).min(1).messages({
    ...messages,
    'object.min': 'Au moins un champ doit être fourni pour la mise à jour'
});

/**
 * Validator pour le changement de mot de passe
 * Requiert l'ancien mot de passe pour des raisons de sécurité
 */
const updatePassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: fields.password.required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({ 'any.only': 'Les mots de passe ne correspondent pas' })
}).messages(messages);

/**
 * Validator pour la mise à jour d'utilisateur par un admin
 * Permet de modifier tous les champs, y compris role, plan, isActive, etc.
 */
const adminUpdateUser = Joi.object({
    firstName: fields.firstName,
    lastName: fields.lastName,
    company: fields.company,
    email: fields.email,
    role: fields.role,
    plan: fields.plan,
    isActive: fields.isActive,
    rateLimit: fields.rateLimit,
    apiKeyScopes: fields.apiKeyScopes
}).min(1).messages({
    ...messages,
    'object.min': 'Au moins un champ doit être fourni pour la mise à jour'
});

/**
 * Validator pour les paramètres de route utilisant un UUID
 */
const paramsUuid = Joi.object({
    uuid: fields.uuid.required()
}).messages(messages);

/**
 * Validator pour les paramètres de route utilisant un ObjectId MongoDB
 */
const paramsId = Joi.object({
    id: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({ 'string.pattern.base': 'Format ObjectId MongoDB invalide' })
}).messages(messages);

module.exports = {
    createUserValidator,    // Création d'utilisateur par admin (avec role, plan)
    updateUserValidator,    // Mise à jour profil utilisateur standard
    updatePassword,         // Changement de mot de passe sécurisé
    adminUpdateUser,        // Mise à jour complète par admin
    paramsUuid,             // Validation paramètre UUID
    paramsId                // Validation paramètre ObjectId MongoDB
};