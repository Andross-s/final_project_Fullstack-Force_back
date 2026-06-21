import createHttpError from "http-errors";
import { User } from "../../models/user.js";
import { Recipe } from "../../models/recipe.js";

export const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    //  Перевіряємо, чи існує рецепт
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw createHttpError(404, "Рецепт не знайдено");
    }

    const user = await User.findById(userId);

    //  Перевіряємо, чи вже є в улюблених
    const exists = user.favorites.some(
      (id) => id.toString() === recipeId
    );

    if (exists) {
      throw createHttpError(409, "Рецепт вже в улюблених");
    }

    user.favorites.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Додано до улюблених" });

  } catch (error) {
    next(error);
  }
};
