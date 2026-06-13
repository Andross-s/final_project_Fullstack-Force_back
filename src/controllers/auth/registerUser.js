
import createHttpError from "http-errors";
import { User } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../../services/auth.js";
import { Session } from "../../models/session.js";



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

  
  const userResponse = newUser.toObject();
  delete userResponse.password;

 
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: userResponse
  });
};

