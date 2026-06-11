import { Schema, model } from "mongoose";

const userSchema = new Schema({});

// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model("user", userSchema);
