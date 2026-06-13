import { Schema, model } from "mongoose";

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export const Categories = model("Category", categoriesSchema, "categories");
