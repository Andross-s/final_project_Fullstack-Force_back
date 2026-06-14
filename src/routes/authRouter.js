import { Router } from "express";
import { celebrate } from "celebrate";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/authValidation.js";
import { auth } from "../controllers/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", celebrate(registerUserSchema), auth.registerUser);
authRouter.post("/login", celebrate(loginUserSchema), auth.loginUser);
authRouter.post("/refresh", auth.refreshUserSession);
authRouter.post("/logout", authMiddleware, auth.logout);

export default authRouter;
