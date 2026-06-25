import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import { User } from "../../models/user.js";

export const logout = async (req, res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies ?? {};

    if (!sessionId || !accessToken) {
      return next(createHttpError(401, "Unauthorized"));
    }

    // Видаляємо саме цю сесію (ревокація accessToken)
    await Session.deleteOne({ _id: sessionId, accessToken });

    // Додатково очищаємо refreshToken у user (якщо потрібне)
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
