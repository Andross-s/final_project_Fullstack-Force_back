import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import ingredientsRouter from "./routes/ingredientsRouter.js";
import recipesRouter from "./routes/recipesRouter.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// // Middleware

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    origin: "*",
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/recipes", recipesRouter);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Middleware для обробки помилок
app.use(errorHandler);

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
