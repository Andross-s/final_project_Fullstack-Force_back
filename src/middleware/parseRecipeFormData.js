import createHttpError from "http-errors";

export const parseRecipeFormData = (req, res, next) => {
  try {
    if (typeof req.body.ingredients === "string") {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    next();
  } catch {
    next(createHttpError(400, "Invalid ingredients JSON"));
  }
};
