import { User } from "../../models/user.js";
import createHttpError from "http-errors";

export const removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    const user = await User.findById(userId);

    const inFavorites = user.favorites.some((id) => id.toString() === recipeId);

    if (!inFavorites) {
      throw createHttpError(404, "Recipe not found in favorites");
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== recipeId);
    await user.save();

    return res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    next(error);
  }
};
