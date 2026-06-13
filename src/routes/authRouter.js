import { Router } from "express";
import { celebrate } from "celebrate";
import { loginUserSchema } from "../validations/authValidation.js";
import { auth } from "../controllers/index.js";
import { registerUser } from "../controllers/auth/registerUser.js";
import { logout } from "../controllers/auth/logout.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);
authRouter.post("/login", celebrate(loginUserSchema), auth.loginUser);
authRouter.post("/refresh", auth.refreshUserSession);
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
