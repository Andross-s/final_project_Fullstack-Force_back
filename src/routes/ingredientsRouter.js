import { Router } from "express";

import { ingredients as ctrl } from "../controllers/index.js";

const ingredientsRouter = Router();

ingredientsRouter.get("/", ctrl.getIngredients);

export default ingredientsRouter;