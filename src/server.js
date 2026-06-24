import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert { type: "json" };

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

// Дозволені домени фронтенду
const allowedOrigins = [
  "https://final-project-fullstack-force-front.vercel.app",
  "https://final-project-fullstack-force-back-r48i.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// CORS — просте та правильне налаштування
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Базовий захист заголовків
app.use(helmet());

// Парсинг JSON
app.use(express.json({ limit: "5mb" }));

// Парсинг cookies
app.use(cookieParser());

// Swagger документація
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Маршрути API
app.use("/api/auth", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/recipes", recipesRouter);

// Обробка 404
app.use(notFoundHandler);

// Помилки celebrate
app.use(errors());

// Глобальний обробник помилок
app.use(errorHandler);

// Підключення до MongoDB та запуск сервера
try {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
