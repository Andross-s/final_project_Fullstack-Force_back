import { Router } from "express";
import { celebrate } from "celebrate";

import { getRecipeById } from "../controllers/recipes/recipesById.js";
import { createRecipeController } from "../controllers/recipes/createRecipeController.js";

import { getFavorites } from "../controllers/recipes/getFavorites.js";
import { addToFavorites } from "../controllers/recipes/addToFavorites.js";
import { removeFromFavorites } from "../controllers/recipes/removeFromFavorites.js";

import { getRecipes } from "../controllers/recipes/getRecipes.js";
import { getOwnerRecipes } from "../controllers/recipes/ownerRecipes.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerRecipe.js";
import { parseRecipeFormData } from "../middleware/parseRecipeFormData.js";

import {
  validateRecipeId,
} from "../validations/index.js";

import {
  createRecipeSchema,
  getRecipesSchema,
  getOwnerRecipesSchema,
} from "../validations/recipe.js";

const recipesRouter = Router();

// Отримати рецепти поточного користувача
recipesRouter.get(
  "/own",
  authMiddleware,
  celebrate(getOwnerRecipesSchema),
  getOwnerRecipes
);

// Отримати всі рецепти
recipesRouter.get("/", celebrate(getRecipesSchema), getRecipes);

// Отримати улюблені рецепти
recipesRouter.get("/favorites", authMiddleware, getFavorites);

// Додати рецепт до улюблених
recipesRouter.post("/favorites/:recipeId", authMiddleware, addToFavorites);

// Видалити рецепт з улюблених
recipesRouter.delete("/favorites/:recipeId", authMiddleware, removeFromFavorites);

// Створити новий рецепт
recipesRouter.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  parseRecipeFormData,
  celebrate(createRecipeSchema),
  createRecipeController
);

// Отримати рецепт за ID
recipesRouter.get("/:id", validateRecipeId, getRecipeById);

export default recipesRouter;
