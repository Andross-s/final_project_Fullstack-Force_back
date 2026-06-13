import { Ingredient } from "../../models/ingredient.js";

export const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({})
      .select("-__v")
      .sort({ name: 1 })
      .lean();

    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};