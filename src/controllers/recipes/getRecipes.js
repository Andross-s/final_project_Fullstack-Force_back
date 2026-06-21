import { Categories } from "../../models/category.js";
import { Ingredient } from "../../models/ingredient.js";
import { Recipe } from "../../models/recipe.js";

export const getRecipes = async (req, res) => {
  try {
    //  Параметри запиту
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

    //  Основний фільтр
    const filter = {};

    //  Фільтр за категорією
    if (category) {
      const exists = await Categories.exists({ _id: category });
      if (!exists) {
        return res.status(400).json({ message: "Невірна категорія" });
      }
      filter.category = category;
    }

    //  Фільтр за інгредієнтом
    if (ingredient) {
      //  Пошук інгредієнта за назвою
      const ing = await Ingredient.findOne({
        name: { $regex: ingredient, $options: "i" },
      });

      if (!ing) {
        return res.status(400).json({ message: "Інгредієнт не знайдено" });
      }

      filter["ingredients.ingredient"] = ing._id;
    }

    //  Пошук за назвою рецепта
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    //  Фільтр за часом
    if (maxTime) {
      filter.time = { $lte: Number(maxTime) };
    }

    //  Фільтр за калоріями
    if (maxCalories) {
      filter.calories = { $lte: Number(maxCalories) };
    }

    //  Паралельні запити
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
