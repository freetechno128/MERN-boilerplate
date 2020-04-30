const Joi = require('joi');

const loginQuerySchema = Joi.object({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(8).max(64).required(),
});

module.exports = loginQuerySchema;