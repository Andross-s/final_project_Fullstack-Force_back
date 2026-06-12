import { Router } from "express";
import { getFavorites } from "../controllers/recipes/getFavorites.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const recipesRouter = Router();


recipesRouter.get("/favorites", authMiddleware, getFavorites);

export default recipesRouter;
