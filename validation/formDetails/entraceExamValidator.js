const Joi = require("joi");

// --------------------- CREATE VALIDATION ---------------------
const entranceExamCreateValidation = Joi.object({
  ugcNet: Joi.object({
    qualified: Joi.string().valid("yes", "no").required(),
    subject: Joi.string().when("qualified", {
      is: "yes",
      then: Joi.required(),
    }),
    year: Joi.number()
      .min(1900)
      .max(new Date().getFullYear())
      .when("qualified", { is: "yes", then: Joi.required() }),
    jrf: Joi.string()
      .valid("yes", "no")
      .when("qualified", { is: "yes", then: Joi.required() }),
  }).required(),

  gate: Joi.object({
    qualified: Joi.string().valid("yes", "no").required(),
    discipline: Joi.string().when("qualified", {
      is: "yes",
      then: Joi.required(),
    }),
    score: Joi.string().when("qualified", { is: "yes", then: Joi.required() }),
    year: Joi.number()
      .min(1900)
      .max(new Date().getFullYear())
      .when("qualified", { is: "yes", then: Joi.required() }),
  }).required(),

  universityPhd: Joi.object({
    appeared: Joi.string().valid("yes", "no").required(),
    year: Joi.number()
      .min(1900)
      .max(new Date().getFullYear())
      .when("appeared", { is: "yes", then: Joi.required() }),
    scoreOrRank: Joi.string().when("appeared", {
      is: "yes",
      then: Joi.required(),
    }),
  }).required(),

  other: Joi.object({
    examName: Joi.string().allow("", null),
    year: Joi.number().min(1900).max(new Date().getFullYear()).allow(null),
    score: Joi.string().allow("", null),
  }).optional(),
});

// --------------------- UPDATE VALIDATION ---------------------
const entranceExamUpdateValidation = Joi.object({
  ugcNet: Joi.object({
    qualified: Joi.string().valid("yes", "no"),
    subject: Joi.string(),
    year: Joi.number().min(1900).max(new Date().getFullYear()),
    jrf: Joi.string().valid("yes", "no"),
  }).optional(),

  gate: Joi.object({
    qualified: Joi.string().valid("yes", "no"),
    discipline: Joi.string(),
    score: Joi.string(),
    year: Joi.number().min(1900).max(new Date().getFullYear()),
  }).optional(),

  universityPhd: Joi.object({
    appeared: Joi.string().valid("yes", "no"),
    year: Joi.number().min(1900).max(new Date().getFullYear()),
    scoreOrRank: Joi.string(),
  }).optional(),

  other: Joi.object({
    examName: Joi.string().allow("", null),
    year: Joi.number().min(1900).max(new Date().getFullYear()).allow(null),
    score: Joi.string().allow("", null),
  }).optional(),
}).min(1); // At least one field required for update

module.exports = {
  entranceExamCreateValidation,
  entranceExamUpdateValidation,
};
