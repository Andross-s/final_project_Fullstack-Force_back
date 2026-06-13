import express from "express";
import { getRecipeById } from "../controllers/recipes/recipesById.js";
import {
  validateRecipeId,
  validateCreateRecipe,
} from "../validations/index.js";

const router = express.Router();

router.get("/:id", getRecipeById);

export default router;
