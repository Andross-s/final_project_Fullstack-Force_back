import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import { createSession } from "../../services/auth.js";

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  // Перевірка наявності куків
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Missing session credentials");
  }

  // Знаходимо сесію
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  // Перевірка терміну дії refresh токена
  const isExpired = session.refreshTokenValidUntil < new Date();
  if (isExpired) {
    await session.deleteOne();

    res.clearCookie("sessionId", { secure: true, sameSite: "none" });
    res.clearCookie("accessToken", { secure: true, sameSite: "none" });
    res.clearCookie("refreshToken", { secure: true, sameSite: "none" });

    throw createHttpError(401, "Session token expired");
  }

  // Видаляємо стару сесію
  await session.deleteOne();

  // Створюємо нову
  const newSession = await createSession(session.userId);

  // Встановлюємо нові куки
  res.cookie("sessionId", newSession._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("accessToken", newSession.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("refreshToken", newSession.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Session refreshed" });
};
