import { Schema, model } from "mongoose";

const userSchema = new Schema(

  {
    name: String,
    email: String,
    avatar: {
      type: String,
      default: null,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model("User", userSchema, "users");
