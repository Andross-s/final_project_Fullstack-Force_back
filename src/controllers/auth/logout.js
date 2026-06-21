import { Session } from "../../models/session.js";

export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    // Видаляємо сесію з бази
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищаємо куки
    res.clearCookie("sessionId", { secure: true, sameSite: "none" });
    res.clearCookie("accessToken", { secure: true, sameSite: "none" });
    res.clearCookie("refreshToken", { secure: true, sameSite: "none" });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
