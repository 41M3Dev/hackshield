const Joi = require('joi');
const { fields, messages } = require('./Common.validator');

const register = Joi.object({
    username: fields.username.required(),
    email: fields.email.required(),
    password: fields.password.required(),
    firstName: fields.firstName.optional(),
    lastName: fields.lastName.optional(),
    company: fields.company.optional()
}).messages(messages);

const login = Joi.object({
    login: Joi.string()
        .required()
        .messages({ 'any.required': "L'email ou le nom d'utilisateur est requis" }),
    password: Joi.string().required()
}).messages(messages);

module.exports = { register, login };