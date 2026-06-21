import { Recipe } from "../models/recipe.js";
import { Ingredient } from "../models/ingredient.js";
import { Categories } from "../models/category.js";

// Создание рецепта
export const createRecipe = async (payload) => {
  const {
    title,
    description,
    instructions,
    time,
    calories,
    category,
    ingredients,
    owner,
    thumb,
  } = payload;

  // Проверяем категорию
  const categoryExists = await Categories.findById(category);
  if (!categoryExists) {
    throw new Error("Категория не найдена");
  }

  // Проверяем ингредиенты
  if (!Array.isArray(ingredients)) {
    throw new Error("Ингредиенты должны быть массивом");
  }

  for (const item of ingredients) {
    const ing = await Ingredient.findById(item.ingredient);
    if (!ing) {
      throw new Error(`Ингредиент не найден: ${item.ingredient}`);
    }
  }

  // Создаём рецепт
  const recipe = await Recipe.create({
    title,
    description,
    instructions,
    time,
    calories,
    category,
    ingredients,
    owner,
    thumb,
  });

  // Возвращаем рецепт с populate
  return await Recipe.findById(recipe._id)
    .populate("category")
    .populate("ingredients.ingredient");
};
