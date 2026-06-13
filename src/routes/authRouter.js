import { Router } from "express";

import { auth } from "../controllers/index.js";
import { logout } from "../controllers/auth/logout.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
