import { User } from "../../models/user.js";
import { Recipe } from "../../models/recipe.js";
import createHttpError from "http-errors";

export const removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    //  Перевіряємо, чи існує рецепт
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw createHttpError(404, "Рецепт не знайдено");
    }

    const user = await User.findById(userId);

    const exists = user.favorites.some(
      (id) => id.toString() === recipeId
    );

    if (!exists) {
      throw createHttpError(404, "Рецепта немає в улюблених");
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== recipeId
    );

    await user.save();

    res.status(200).json({ message: "Видалено з улюблених" });

  } catch (error) {
    next(error);
  }
};
