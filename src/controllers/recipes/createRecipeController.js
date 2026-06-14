import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { createRecipe } from "../../services/recipes.js";

export const createRecipeController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "No photo");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "recipes" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const recipe = await createRecipe({
      ...req.body,
      owner: req.user._id,
      photo: result.secure_url,
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


