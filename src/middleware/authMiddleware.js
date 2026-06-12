import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Not authorized"));
  }
};
