import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    // Назва рецепта
    title: { type: String, required: true },

    // Короткий опис
    description: { type: String },

    // Інструкція приготування
    instructions: { type: String },

    // Фото
    thumb: {
      type: String,
      default:
        "https://res.cloudinary.com/dkiruwtcx/image/upload/q_auto/f_auto/v1781512091/Photo_dkn9mn.png",
    },

    // Час приготування (хв)
    time: { type: Number },

    // Калорії
    calories: { type: Number, default: null },

    // Категорія
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Власник рецепта
    owner: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // Інгредієнти
    ingredients: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
        },
        amount: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Модель рецепта
export const Recipe = model("Recipe", recipeSchema);
