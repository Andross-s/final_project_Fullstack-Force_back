import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { refreshUserSession } from "./auth/refreshUser.js";

export const auth = {
  registerUser,
  loginUser,
  refreshUserSession,
};
