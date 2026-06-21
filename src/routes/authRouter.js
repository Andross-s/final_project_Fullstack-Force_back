import { Router } from "express";
import { celebrate } from "celebrate";

import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/authValidation.js";

import { auth } from "../controllers/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

// Реєстрація нового користувача
authRouter.post("/register", celebrate(registerUserSchema), auth.registerUser);

// Вхід користувача
authRouter.post("/login", celebrate(loginUserSchema), auth.loginUser);

// Оновлення сесії користувача
authRouter.post("/refresh", auth.refreshUserSession);

// Вихід користувача (потрібна авторизація)
authRouter.post("/logout", authMiddleware, auth.logout);

export default authRouter;
