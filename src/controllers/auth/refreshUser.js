import createHttpError from "http-errors";
import { User } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createSession } from "../../services/auth.js";
import { Session } from "../../models/session.js";

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Missing session credentials");
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isSessionTokenExpired) {
    await session.deleteOne();
    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw createHttpError(401, "Session token expired");
  }

  await session.deleteOne();
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: "Session refreshed" });
};
