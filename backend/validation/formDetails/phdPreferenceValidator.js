const Joi = require("joi");

const phdPreferencesValidator = Joi.object({
  programType: Joi.array()
    .items(Joi.string().valid("fulltime", "parttime"))
    .min(1)
    .required()
    .messages({
      "any.required": "Program type is required",
      "array.min": "Select at least one program type",
      "array.includes": "Invalid program type selected",
    }),

  faculties: Joi.array()
    .items(
      Joi.object({
        facultyName: Joi.string().min(2).max(100).required().messages({
          "any.required": "Faculty name is required",
          "string.empty": "Faculty name cannot be empty",
          "string.min": "Faculty name must be at least 2 characters",
        }),

        departments: Joi.array()
          .items(
            Joi.string().min(2).max(100).required().messages({
              "string.min": "Department name must be at least 2 characters",
              "any.required": "Department name is required",
            })
          )
          .min(1)
          .required()
          .messages({
            "array.min": "Select at least one department",
            "any.required": "Departments are required",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "At least one faculty must be selected",
      "array.min": "At least one faculty must be provided",
    }),
});

module.exports = phdPreferencesValidator;
