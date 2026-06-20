import { Categories } from "../../models/category.js";
import { Ingredient } from "../../models/ingredient.js";
import Recipe from "../../models/recipe.js";

export const getRecipes = async (req, res) => {
  const { page = 1, perPage = 10, category, ingredient, search } = req.query;
  const skip = (page - 1) * perPage;

  const recipesQuery = Recipe.find();

  if (category) {
    const dbCategory = await Categories.findOne({ name: category });
    if (!dbCategory) {
      return res.status(400).json({ message: "Invalid category" });
    } else {
      recipesQuery.where("category").equals(dbCategory.name);
    }
  }

  if (ingredient) {
    const exists = await Ingredient.exists({ name: ingredient });
    if (!exists) {
      return res.status(400).json({ message: "Ingredient not found" });
    } else {
      recipesQuery.where({
        "ingredients.name": { $regex: ingredient, $options: "i" },
      });
    }
  }

  if (search) {
    recipesQuery.where({
      title: { $regex: search, $options: "i" },
    });
  }

  const [totalRecipes, recipes] = await Promise.all([
    recipesQuery.clone().countDocuments(),
    recipesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalRecipes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalRecipes,
    totalPages,
    recipes,
  });
};
