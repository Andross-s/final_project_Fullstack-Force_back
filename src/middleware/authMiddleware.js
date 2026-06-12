import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      throw createHttpError(401, "Not authorized");
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      throw createHttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Not authorized"));
  }
};
