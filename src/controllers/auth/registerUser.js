import handlebars from 'handlebars';
import createHttpError from "http-errors";
import { User } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../../services/auth.js";
import { Session } from "../../models/session.js";
// import { sendEmail } from "../utils/sendMail.js";
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

export const registerUser = async (req, res, next) => {

  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }

 
  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters");
  }

  
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createHttpError(400, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10); 

  
  const newUser = await User.create({
    name: name,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  // НОВЕ: Видаляємо пароль з відповіді
  const userResponse = newUser.toObject();
  delete userResponse.password;

 
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: userResponse
  });
};


export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isValidePassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidePassword) {
    throw createHttpError(401, "Invalid credentials");
  }
  
  await Session.deleteOne({ userId: user._id });
  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Invalid session");
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Invalid session");
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();
  if (isRefreshTokenExpired) {
    await session.deleteOne();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");
    throw createHttpError(401, "Invalid session");
  }

  await session.deleteOne();

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: "Session refreshed" });
};