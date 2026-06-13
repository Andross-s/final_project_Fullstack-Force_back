import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    instructions: String,
    description: String,
    area: String,
    time: Number,
    ingredients: [
      {
        name: String,
        measure: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Recipe", recipeSchema, "recipes");
