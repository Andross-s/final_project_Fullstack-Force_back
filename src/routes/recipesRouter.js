import { Router } from "express";
import { createRecipeController } from '../controllers/recipes/createRecipeController.js';

const recipesRouter = Router();

recipesRouter.post(
  '/',
//   authenticate,
//   validateBody(createRecipeSchema),
  createRecipeController,
);

export default recipesRouter;
