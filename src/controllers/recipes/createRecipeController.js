import createHttpError from "http-errors";
import { createRecipe } from "../../services/recipes.js";
import { saveFileToCloudinary } from "../../utils/saveFileToCloudinary.js";

export const createRecipeController = async (req, res, next) => {
  try {
    const { file, user } = req;

    // Проверяем, есть ли фото
    if (!file) {
      throw createHttpError(400, "Фото не загружено");
    }

    // Загружаем фото в Cloudinary
    const publicId = `recipe_${user._id}_${Date.now()}`;
    const uploadResult = await saveFileToCloudinary(file.buffer, publicId, {
      folder: "recipes",
      public_id: publicId,
      overwrite: false,
      unique_filename: true,
    });

    // Создаём рецепт
    const recipe = await createRecipe({
      ...req.body,
      owner: user._id,
      thumb: uploadResult.secure_url,
    });

    // Ответ
    res.status(201).json({
      status: 201,
      message: "Рецепт успешно создан",
      data: recipe,
    });

  } catch (error) {
    console.error("createRecipeController error:", error);
    next(error);
  }
};
