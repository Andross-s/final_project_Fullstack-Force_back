import { Schema, model } from "mongoose";

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
  },
);

export const Ingredient = model(
  "ingredient",
  ingredientSchema,
  "ingredients",
);