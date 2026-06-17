import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies ?? {};

    if (!sessionId || !accessToken) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const session = await Session.findOne({ _id: sessionId, accessToken });

    if (!session) {
      return next(createHttpError(401, "Session not found"));
    }

    if (
      session.accessTokenValidUntil &&
      session.accessTokenValidUntil < new Date()
    ) {
      await session.deleteOne();
      res.clearCookie("sessionId");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return next(createHttpError(401, "Access token expired"));
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
