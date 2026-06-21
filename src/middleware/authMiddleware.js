import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies;

    // Перевірка наявності сесійних даних
    if (!sessionId || !accessToken) {
      throw createHttpError(401, "Відсутні дані сесії");
    }

    // Пошук сесії
    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      throw createHttpError(401, "Сесію не знайдено");
    }

    // Перевірка строку дії токена
    const isExpired = session.accessTokenValidUntil < new Date();
    if (isExpired) {
      throw createHttpError(401, "Термін дії токена минув");
    }

    // Пошук користувача
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, "Користувача не знайдено");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
