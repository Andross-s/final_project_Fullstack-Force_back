import express from "express";
import { getRecipeById } from "../controllers/recipes/recipesById.js";
import {
  validateRecipeId,
  validateCreateRecipe,
} from "../validations/index.js";

<<<<<<< HEAD
const router = express.Router();

router.get("/:id", getRecipeById);

export default router;
=======
import { createRecipeController } from '../controllers/recipes/createRecipeController.js';
import { getFavorites } from "../controllers/recipes/getFavorites.js";
import { addToFavorites } from "../controllers/recipes/addToFavorites.js";
import { removeFromFavorites } from "../controllers/recipes/removeFromFavorites.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const recipesRouter = Router();

recipesRouter.get("/favorites", authMiddleware, getFavorites);
recipesRouter.post("/favorites/:recipeId", authMiddleware, addToFavorites);
recipesRouter.delete(
  "/favorites/:recipeId",
  authMiddleware,
  removeFromFavorites,
);

recipesRouter.post(
  '/',
//   authenticate,                       Тут вставити актуальні назви
//   validateBody(createRecipeSchema),
  createRecipeController,
);


export default recipesRouter;
>>>>>>> main
