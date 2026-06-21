import createHttpError from "http-errors";

export const parseRecipeFormData = (req, res, next) => {
  try {
    // Якщо інгредієнти передані як JSON-рядок — парсимо
    if (typeof req.body.ingredients === "string") {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    next();
  } catch {
    next(createHttpError(400, "Невірний формат JSON у полі ingredients"));
  }
};
