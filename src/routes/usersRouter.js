import { Router } from "express";
import { celebrate } from "celebrate";

import { getUserById } from "../controllers/users/getUserById.js";
import { getUserByIdSchema } from "../validations/users.js";

const usersRouter = Router();

// Підключити middleware авторизації після реалізації auth-модуля.
// Поки авторизація не реалізована, ендпоінт не може бути приватним.
// Після завершення auth-модуля достатньо додати authenticate до роуту.

usersRouter.get('/:userId',/* authenticate,*/ celebrate(getUserByIdSchema), getUserById);

export default usersRouter;
