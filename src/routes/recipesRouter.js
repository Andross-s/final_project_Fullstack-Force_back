import { Router } from "express";
import { getFavorites } from "../controllers/recipes/getFavorites.js";
<<<<<<< HEAD
import { addToFavorites } from "../controllers/recipes/addToFavorites.js";
import { removeFromFavorites } from "../controllers/recipes/removeFromFavorites.js";
=======
>>>>>>> origin/main
import { authMiddleware } from "../middleware/authMiddleware.js";

const recipesRouter = Router();

<<<<<<< HEAD
recipesRouter.get("/favorites", authMiddleware, getFavorites);
recipesRouter.post("/favorites/:recipeId", authMiddleware, addToFavorites);
recipesRouter.delete(
  "/favorites/:recipeId",
  authMiddleware,
  removeFromFavorites,
);
=======

recipesRouter.get("/favorites", authMiddleware, getFavorites);
>>>>>>> origin/main

export default recipesRouter;
