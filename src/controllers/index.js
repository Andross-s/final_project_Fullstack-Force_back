import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { refreshUserSession } from "./auth/refreshUser.js";
import { logout } from "./auth/logout.js";

import { getCategories } from "./categories/getCategories.js";
import { getIngredients } from "./ingredients/getIngredients.js";
export const auth = {
  registerUser,
  loginUser,
  refreshUserSession,
  logout,
};

export const categories = {
  getCategories,
};
export const ingredients = {
  getIngredients,
};
