import mongoose from "mongoose";

// Підключення до MongoDB
export async function connectMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("Не вказано MONGO_URL у змінних середовища");
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB підключено успішно");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
}
