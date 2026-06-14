import { Joi, Segments } from "celebrate";

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.string().required(),
  }),
};

export const getRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    ingredient: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    search: Joi.string().trim().allow(""),
  }),
};
