import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    // 📝 Назва рецепта
    title: { type: String, required: true },

    // 🧾 Опис
    description: { type: String },

    // 📖 Інструкція приготування
    instructions: { type: String },

    // 🖼 Фото рецепта
    thumb: {
      type: String,
      default:
        "https://res.cloudinary.com/dkiruwtcx/image/upload/q_auto/f_auto/v1781512091/Photo_dkn9mn.png",
    },

    // ⏱ Час приготування
    time: { type: Number },

    // 🔥 Калорії
    calories: { type: Number, default: null },

    // 🏷 Категорія (ВИПРАВЛЕНО: було categories)
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    // 👤 Власник рецепта
    owner: { type: Schema.Types.ObjectId, ref: "user", default: null },

    // 🧂 Інгредієнти
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
