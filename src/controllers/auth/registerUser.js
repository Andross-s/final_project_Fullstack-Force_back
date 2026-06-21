import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../../models/user.js";
import { createSession } from "../../services/auth.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Перевірка полів
  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }

  if (password.length < 8) {
    throw createHttpError(400, "Password must be at least 8 characters");
  }

  // Перевірка чи існує користувач
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createHttpError(400, "Email in use");
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення користувача
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // Створення сесії
  const session = await createSession(newUser._id);

  // Встановлення куків
  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // Повертаємо користувача без пароля
  const userResponse = newUser.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: userResponse,
  });
};
