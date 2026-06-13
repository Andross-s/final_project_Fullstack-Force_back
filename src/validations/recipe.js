import { Joi, Segments } from 'celebrate';

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.string().required(),
  }),
};