// validation/auth/forgotPasswordValidator.js
const Joi = require("joi");

const forgotValidator = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = forgotValidator;
