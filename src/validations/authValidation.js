import { Joi, Segments } from "celebrate";

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(16).required(),
    email: Joi.string().email().max(128).required(),
    password: Joi.string().min(8).max(128).required()
  })
};