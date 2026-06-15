import createHttpError from "http-errors";
import { createRecipe } from "../../services/recipes.js";
import { saveFileToCloudinary } from "../../utils/saveFileToCloudinary.js";

export const createRecipeController = async (req, res, next) => {
  const { file, user } = req;
  try {
    if (!file) {
      throw createHttpError(400, "No photo");
    }

    const publicId = `recipe_${user._id}_${Date.now()}`;
    const result = await saveFileToCloudinary(file.buffer, publicId, {
      folder: "recipes",
      public_id: publicId,
      overwrite: false,
      unique_filename: true,
    });

    const recipe = await createRecipe({
      ...req.body,
      owner: user._id,
      thumb: result.secure_url,
    });

    res.status(201).json({
      status: 201,
      message: "✅ Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};
