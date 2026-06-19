import { Categories } from "../../models/category.js";
import { Ingredient } from "../../models/ingredient.js";
import Recipe from "../../models/recipe.js";

export const getRecipes = async (req, res) => {
  try {
    // 📌 Отримуємо параметри запиту
    const {
      page = 1,
      perPage = 10,
      category,
      ingredient,
      search,
      maxTime,
      maxCalories,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(perPage);
    const skip = (pageNum - 1) * limitNum;

    // 📌 Основний фільтр
    const filter = {};

    // ================================
    // 🏷 ФІЛЬТР ЗА КАТЕГОРІЄЮ
    // ================================
    if (category) {
      const exists = await Categories.exists({ _id: category });

      if (!exists) {
        return res.status(400).json({ message: "Invalid category" });
      }

      filter.category = category;
    }

    // ================================
    // 🧂 ФІЛЬТР ЗА ІНГРЕДІЄНТОМ
    // ================================
    if (ingredient) {
      // 1️⃣ Знаходимо інгредієнт за назвою
      const ing = await Ingredient.findOne({
        name: { $regex: ingredient, $options: "i" },
      });

      if (!ing) {
        return res.status(400).json({ message: "Ingredient not found" });
      }

      // 2️⃣ Фільтруємо рецепти за ObjectId інгредієнта
      filter["ingredients.ingredient"] = ing._id;
    }

    // ================================
    // 🔍 ПОШУК ЗА НАЗВОЮ РЕЦЕПТА
    // ================================
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // ================================
    // ⏱ ФІЛЬТР ЗА МАКС. ЧАСОМ
    // ================================
    if (maxTime) {
      filter.time = { $lte: Number(maxTime) };
    }

    // ================================
    // 🔥 ФІЛЬТР ЗА МАКС. КАЛОРІЯМИ
    // ================================
    if (maxCalories) {
      filter.calories = { $lte: Number(maxCalories) };
    }

    // ================================
    // 📌 ПАРАЛЕЛЬНІ ЗАПИТИ
    // ================================
    const [totalRecipes, recipes] = await Promise.all([
      Recipe.countDocuments(filter),
      Recipe.find(filter)
        .skip(skip)
        .limit(limitNum)
        .populate("ingredients.ingredient") // 🔥 додаємо назви інгредієнтів
        .populate("category"), // 🔥 додаємо дані категорії
    ]);

    const totalPages = Math.ceil(totalRecipes / limitNum);

    // ================================
    // 📌 ЧИ Є ЩЕ СТОРІНКИ?
    // ================================
    const hasMore = pageNum < totalPages;

    // ================================
    // 📌 ВІДПОВІДЬ
    // ================================
    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalRecipes,
      totalPages,
      hasMore, // 🔥 ДЛЯ Load More
      recipes,
    });

  } catch (error) {
    console.error("getRecipes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
