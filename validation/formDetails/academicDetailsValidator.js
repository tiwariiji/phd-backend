const Joi = require("joi");

// ---------------- CREATE VALIDATION  ----------------
const academicDetailsCreateValidation = Joi.object({
  class10: Joi.object({
    board: Joi.string().trim().required(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .required(),
    percentageOrCGPA: Joi.string().required(),
  }).required(),

  class12: Joi.object({
    board: Joi.string().trim().required(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .required(),
    percentageOrCGPA: Joi.string().required(),
  }).required(),

  bachelors: Joi.object({
    degreeName: Joi.string().required(),
    universityInstitute: Joi.string().required(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .required(),
    percentageOrCGPA: Joi.string().required(),
    majorSubjects: Joi.string().required(),
  }).required(),

  masters: Joi.object({
    degreeName: Joi.string().allow("", null),
    universityInstitute: Joi.string().allow("", null),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .allow(null),
    percentageOrCGPA: Joi.string().allow("", null),
    thesisTitle: Joi.string().allow("", null),
  }).optional(),

  mphil: Joi.object({
    universityInstitute: Joi.string().allow("", null),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .allow(null),
    percentageOrCGPA: Joi.string().allow("", null),
    thesisTitle: Joi.string().allow("", null),
  }).optional(),
});

// ---------------- UPDATE VALIDATION ----------------
const academicDetailsUpdateValidation = Joi.object({
  class10: Joi.object({
    board: Joi.string().trim().optional(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .optional(),
    percentageOrCGPA: Joi.string().optional(),
  }).optional(),

  class12: Joi.object({
    board: Joi.string().trim().optional(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .optional(),
    percentageOrCGPA: Joi.string().optional(),
  }).optional(),

  bachelors: Joi.object({
    degreeName: Joi.string().optional(),
    universityInstitute: Joi.string().optional(),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .optional(),
    percentageOrCGPA: Joi.string().optional(),
    majorSubjects: Joi.string().optional(),
  }).optional(),

  masters: Joi.object({
    degreeName: Joi.string().allow("", null),
    universityInstitute: Joi.string().allow("", null),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .allow(null),
    percentageOrCGPA: Joi.string().allow("", null),
    thesisTitle: Joi.string().allow("", null),
  }).optional(),

  mphil: Joi.object({
    universityInstitute: Joi.string().allow("", null),
    yearOfPassing: Joi.number()
      .min(1950)
      .max(new Date().getFullYear())
      .allow(null),
    percentageOrCGPA: Joi.string().allow("", null),
    thesisTitle: Joi.string().allow("", null),
  }).optional(),
}).min(1); // Must update at least 1 field

module.exports = {
  academicDetailsCreateValidation,
  academicDetailsUpdateValidation,
};
