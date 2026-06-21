import { Router } from "express";
import { categories as ctrl } from "../controllers/index.js";

const categoriesRouter = Router();

// Отримати список категорій
categoriesRouter.get("/", ctrl.getCategories);

export default categoriesRouter;
