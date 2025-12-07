const Joi = require("joi");

//create personal details
const personalDetailsValidator = Joi.object({
  // PERSONAL DETAILS
  name: Joi.string().min(3).max(100).required(),

  fatherName: Joi.string().min(3).max(100).required(),

  motherName: Joi.string().min(3).max(100).required(),

  dob: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Date of birth must be in DD/MM/YYYY format",
    }),

  gender: Joi.string().valid("male", "female", "other").required(),

  category: Joi.string().valid("general", "obc", "sc", "st", "ews").required(),

  nationality: Joi.string().min(3).max(50).required(),

  aadhaarNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhaar number must be 12 digits",
    }),

  // CONTACT DETAILS
  permanentAddress: Joi.string().min(5).max(300).required(),

  correspondenceAddress: Joi.string().min(5).max(300).required(),

  mobileNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid 10-digit Indian number",
    }),

  alternateMobileNumber: Joi.string()
    .allow("", null)
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base":
        "Alternate number must be a valid 10-digit Indian number",
    }),

  email: Joi.string().email().required(),
});

//update personal detdils
const updatePersonalDetailsValidator = Joi.object({
  name: Joi.string().min(3).max(100),

  fatherName: Joi.string().min(3).max(100),

  motherName: Joi.string().min(3).max(100),

  dob: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/)
    .messages({
      "string.pattern.base": "Date of birth must be in DD/MM/YYYY format",
    }),

  gender: Joi.string().valid("male", "female", "other"),

  category: Joi.string().valid("general", "obc", "sc", "st", "ews"),

  nationality: Joi.string().min(3).max(50),

  aadhaarNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .messages({
      "string.pattern.base": "Aadhaar number must be 12 digits",
    }),

  permanentAddress: Joi.string().min(5).max(300),

  correspondenceAddress: Joi.string().min(5).max(300),

  mobileNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid 10-digit Indian number",
    }),

  alternateMobileNumber: Joi.string()
    .allow("", null)
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base":
        "Alternate number must be a valid 10-digit Indian number",
    }),

  email: Joi.string().email(),
});

module.exports = {
  personalDetailsValidator,
  updatePersonalDetailsValidator,
};
