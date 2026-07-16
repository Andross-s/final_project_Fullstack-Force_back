import createHttpError from "http-errors";
import Recipe from "../../models/recipe.js";

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      throw createHttpError(404, "Recipe not found");
    }

    if (!recipe.owner || recipe.owner.toString() !== userId.toString()) {
      throw createHttpError(403, "You are not allowed to delete this recipe");
    }

    await recipe.deleteOne();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};
