import { Router } from "express";
import { celebrate } from "celebrate";

import { getUserById } from "../controllers/users/getUserById.js";
import { getUserByIdSchema } from "../validations/users.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const usersRouter = Router();

usersRouter.get(
  "/:userId",
  authMiddleware,
  celebrate(getUserByIdSchema),
  getUserById,
);

export default usersRouter;
