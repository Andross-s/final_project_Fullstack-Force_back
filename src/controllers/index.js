import { registerUser } from "./auth/registerUser.js";

import { getCategories } from "./categories/getCategories.js";

export const auth = {
  registerUser,
};

export const categories = {
  getCategories,
};
