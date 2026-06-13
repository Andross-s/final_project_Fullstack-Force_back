import createHttpError from "http-errors";
import { User } from "../../models/user.js";

export const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.params;

    const user = await User.findById(userId);

    if (user.favorites.includes(recipeId)) {
      throw createHttpError(409, "Recipe already in favorites");
    }

    user.favorites.push(recipeId);
    await user.save();

    return res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    next(error);
  }
};
