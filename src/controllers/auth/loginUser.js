import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../../models/user.js";
import { Session } from "../../models/session.js";
import { createSession } from "../../services/auth.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Перевірка користувача
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  // Перевірка пароля
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  // Видаляємо стару сесію
  await Session.deleteOne({ userId: user._id });

  // Створюємо нову сесію
  const newSession = await createSession(user._id);

  // Встановлюємо куки
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

  // Повертаємо користувача без пароля
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json(userResponse);
};
