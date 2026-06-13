import { celebrate, Joi, Segments } from "celebrate";

export const validateRecipeId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

export const validateCreateRecipe = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    instructions: Joi.string().required(),
    description: Joi.string().allow(""),
    area: Joi.string().allow(""),
    time: Joi.number().required(),
    ingredients: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        measure: Joi.string().required(),
      }),
    ),
  }),
});
