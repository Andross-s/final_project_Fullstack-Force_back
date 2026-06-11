import { Router } from "express";

import { auth } from "../controllers/index.js";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

export default authRouter;
