import { Categories } from "../../models/category.js";
import { Ingredient } from "../../models/ingredient.js";
import Recipe from "../../models/recipe.js";
import { escapeRegExp } from "../../utils/escapeRegExp.js";

export const getRecipes = async (req, res) => {
  try {
    // Параметри запиту
    const {
      page = 1,
      perPage = 10,
      category,
      ingredient,
      search,
      maxTime,
      maxCalories,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(perPage));
    const skip = (pageNum - 1) * limitNum;

    // Основний фільтр
    const filter = {};

    // Фільтр за категорією
    if (category) {
      const exists = await Categories.exists({ _id: category });
      if (!exists) {
        return res.status(400).json({ message: "Невірна категорія" });
      }
      filter.category = category;
    }

    // Фільтр за інгредієнтом
    if (ingredient) {
      // 1️⃣ Знаходимо всі інгредієнти, що збігаються за назвою
      const matchingIngredients = await Ingredient.find({
        name: { $regex: escapeRegExp(ingredient), $options: "i" },
      });

      if (matchingIngredients.length === 0) {
        return res.status(400).json({ message: "Інгредієнт не знайдено" });
      }

      // 2️⃣ Фільтруємо рецепти за ObjectId будь-якого зі знайдених інгредієнтів
      filter["ingredients.ingredient"] = {
        $in: matchingIngredients.map((ing) => ing._id),
      };
    }

    // Пошук за назвою рецепта
    if (search) {
      filter.title = { $regex: escapeRegExp(search), $options: "i" };
    }

    // Фільтр за часом
    if (maxTime) {
      filter.time = { $lte: Number(maxTime) };
    }

    // Фільтр за калоріями
    if (maxCalories) {
      filter.calories = { $lte: Number(maxCalories) };
    }

    // Паралельні запити
    const [totalRecipes, recipes] = await Promise.all([
      Recipe.countDocuments(filter),
      Recipe.find(filter)
        .skip(skip)
        .limit(limitNum)
        .populate("ingredients.ingredient")
        .populate("category"),
    ]);

    const totalPages = Math.ceil(totalRecipes / limitNum);

    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalRecipes,
      totalPages,
      hasMore: pageNum < totalPages,
      recipes,
    });
  } catch (error) {
    console.error("getRecipes error:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
