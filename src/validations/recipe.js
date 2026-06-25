import { Joi, Segments } from "celebrate";

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          ingredient: Joi.string().hex().length(24).required(),
          amount: Joi.string().required(),
        }),
      )
      .min(1)
      .required(),
    instructions: Joi.string().required(),

    // Назва поля має збігатися з полем у моделі (category, не categories)
    category: Joi.string().hex().length(24).required(),

    thumb: Joi.string().uri().optional(),
    time: Joi.number().integer().min(1).optional(),
    calories: Joi.number().optional(),
  }),
};
export const getOwnerRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(4).max(20).default(12),
    category: Joi.string().trim(),
    search: Joi.string().trim().allow(""),
  }),
};

export const getRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    ingredient: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    search: Joi.string().trim().allow(""),
    maxTime: Joi.number().integer().min(1).optional(),
    maxCalories: Joi.number().min(0).optional(),
  }),
};
