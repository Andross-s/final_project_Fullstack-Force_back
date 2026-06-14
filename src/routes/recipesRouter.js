import { Router } from "express";
import { celebrate } from "celebrate";
import { getRecipeById } from "../controllers/recipes/recipesById.js";
import {
  validateRecipeId,
  validateCreateRecipe,
} from "../validations/index.js";
import { createRecipeController } from "../controllers/recipes/createRecipeController.js";
import { getFavorites } from "../controllers/recipes/getFavorites.js";
import { addToFavorites } from "../controllers/recipes/addToFavorites.js";
import { removeFromFavorites } from "../controllers/recipes/removeFromFavorites.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getRecipes } from "../controllers/recipes/getRecipes.js";
import { getRecipesSchema } from "../validations/recipe.js";

import { getOwnerRecipes } from "../controllers/recipes/ownerRecipes.js";
import { getOwnerRecipesSchema } from "../validations/recipe.js";

const recipesRouter = Router();

recipesRouter.get("/:id", getRecipeById);

recipesRouter.get(
  "/own",
  authMiddleware,
  celebrate(getOwnerRecipesSchema),
  getOwnerRecipes,
);
recipesRouter.get("/", celebrate(getRecipesSchema), getRecipes);
recipesRouter.get("/favorites", authMiddleware, getFavorites);
recipesRouter.post("/favorites/:recipeId", authMiddleware, addToFavorites);
recipesRouter.delete(
  "/favorites/:recipeId",
  authMiddleware,
  removeFromFavorites,
);

recipesRouter.post(
  "/", //   authenticate,                       Тут вставити актуальні назви
  //   validateBody(createRecipeSchema),
  createRecipeController,
);

export default recipesRouter;
