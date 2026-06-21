import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  // Обробка HTTP-помилок
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || "Помилка запиту",
    });
  }

  // Невідома помилка
  res.status(500).json({
    message: isProd ? "Помилка сервера" : err.message,
  });
};
