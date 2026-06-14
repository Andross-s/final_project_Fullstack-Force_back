import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    thumb: { type: String },
    time: { type: Number },
    calories: { type: Number, default: null },
    categories: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "user", default: null },
    ingredients: [
      {
        ingredient: { type: Schema.Types.ObjectId, ref: "ingredient" },
        amount: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const Recipe = model("recipe", recipeSchema);

export default Recipe;
