import { Schema, model } from "mongoose";

const categoriesSchema = new Schema({});

export const Categories = model("categorie", categoriesSchema);
