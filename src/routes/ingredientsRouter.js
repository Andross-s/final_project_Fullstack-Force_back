import { Router } from "express";
import { ingredients as ctrl } from "../controllers/index.js";

const ingredientsRouter = Router();

// Отримати список інгредієнтів
ingredientsRouter.get("/", ctrl.getIngredients);

export default ingredientsRouter;
