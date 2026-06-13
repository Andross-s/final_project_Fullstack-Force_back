import Recipe from "../models/recipe.js";

export const createRecipe = async (payload) => {
  return await Recipe.create(payload);
};
