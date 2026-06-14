import createHttpError from "http-errors";
import { User } from "../../models/user.js";
import Recipe from "../../models/recipe.js";

export const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw createHttpError(404, "Recipe not found");
    }

    const user = await User.findById(userId);

    const alreadyInFavorites = user.favorites.some(
      (id) => id.toString() === recipeId,
    );

    if (alreadyInFavorites) {
      throw createHttpError(409, "Recipe already in favorites");
    }

    user.favorites.push(recipeId);
    await user.save();

    return res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    next(error);
  }
};
