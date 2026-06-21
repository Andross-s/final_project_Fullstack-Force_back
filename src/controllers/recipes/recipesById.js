import { Recipe } from "../../models/recipe.js";

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ищем рецепт по ID и подгружаем связанные данные
    const recipe = await Recipe.findById(id)
      .populate("category") // категория
      .populate("ingredients.ingredient"); // ингредиенты

    // Если рецепт не найден
    if (!recipe) {
      return res.status(404).json({
        message: "Рецепт не найден",
      });
    }

    // Возвращаем рецепт
    res.status(200).json(recipe);

  } catch (error) {
    console.error("getRecipeById error:", error);
    next(error);
  }
};
