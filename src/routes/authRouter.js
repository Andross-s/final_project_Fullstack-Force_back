import { Router } from "express";
import { celebrate } from "celebrate";
import { loginUser } from "../controllers/auth/loginUser.js";
import { loginUserSchema } from "../validations/authValidation.js";
import { auth } from "../controllers/index.js";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/login", celebrate(loginUserSchema), loginUser);

export default authRouter;
