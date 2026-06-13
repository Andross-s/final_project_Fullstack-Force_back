import mongoose from "mongoose";

const recipeSchema = new Schema({});

export const Recipe = model("recipe", recipeSchema);
