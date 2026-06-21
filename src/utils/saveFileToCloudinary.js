import { v2 as cloudinary } from "cloudinary";

// Налаштування Cloudinary
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Завантаження файлу у Cloudinary
export async function saveFileToCloudinary(buffer, publicId, uploadOptions = {}) {
  // Базові параметри завантаження
  const options = {
    folder: "recipes", // Папка за замовчуванням
    public_id: publicId, // Ідентифікатор файлу
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
    transformation: [
      { fetch_format: "auto", quality: "auto" }, // Оптимізація зображення
    ],
    ...uploadOptions, // Можливість перевизначити параметри
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
