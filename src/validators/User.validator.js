const Joi = require('joi');
const { fields, messages } = require('./Common.validator');

const updateProfile = Joi.object({
    firstName: fields.firstName,
    lastName: fields.lastName,
    company: fields.company,
    email: fields.email
}).min(1).messages({
    ...messages,
    'object.min': 'Au moins un champ doit être fourni pour la mise à jour'
});

const updatePassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: fields.password.required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({ 'any.only': 'Les mots de passe ne correspondent pas' })
}).messages(messages);

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

const paramsUuid = Joi.object({
    uuid: fields.uuid.required()
}).messages(messages);

const paramsId = Joi.object({
    id: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({ 'string.pattern.base': 'Format ObjectId MongoDB invalide' })
}).messages(messages);

module.exports = {
    updateProfile,
    updatePassword,
    adminUpdateUser,
    paramsUuid,
    paramsId
};