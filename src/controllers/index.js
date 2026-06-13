import { registerUser } from "./auth/registerUser.js";

import { getCategories } from "./categories/getCategories.js";
import { getIngredients } from "./ingredients/getIngredients.js";
export const auth = {
  registerUser,
};

export const categories = {
  getCategories,
};
export const ingredients = {
  getIngredients,
};