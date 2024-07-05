const Joi = require('joi');

const createOrgSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

const addUserToOrgSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = { createOrgSchema, addUserToOrgSchema };
