import { Joi, Segments } from 'celebrate';

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.string().required(),
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