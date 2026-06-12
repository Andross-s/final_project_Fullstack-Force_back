import { Router } from "express";
import { celebrate } from "celebrate";
import { loginUserSchema } from "../validations/authValidation.js";
import { auth } from "../controllers/index.js";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/login", celebrate(loginUserSchema), auth.loginUser);

authRouter.post("/refresh", auth.refreshUserSession);

export default authRouter;
