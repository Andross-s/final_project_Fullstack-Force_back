import { Recipe } from "../../models/recipe.js";
import { Categories } from "../../models/category.js";

export const getOwnerRecipes = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 12,
      category,
      search,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(perPage));
    const skip = (pageNum - 1) * limitNum;

    //  Базовий запит — рецепти користувача
    const query = { owner: req.user._id };

    //  Фільтр за категорією
    if (category) {
      const exists = await Categories.exists({ _id: category });
      if (!exists) {
        return res.status(400).json({ message: "Невірна категорія" });
      }
      query.category = category;
    }

    //  Пошук за назвою
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [totalRecipes, recipes] = await Promise.all([
      Recipe.countDocuments(query),
      Recipe.find(query)
        .skip(skip)
        .limit(limitNum)
        .populate("category")
        .populate("ingredients.ingredient"),
    ]);

    const totalPages = Math.ceil(totalRecipes / limitNum);

    res.status(200).json({
      page: pageNum,
      perPage: limitNum,
      totalRecipes,
      totalPages,
      recipes,
    });

  } catch (error) {
    console.error("getOwnerRecipes error:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
