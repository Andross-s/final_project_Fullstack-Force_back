import "dotenv/config";
import mongoose from "mongoose";
import { connectMongoDB } from "../db/connectMongoDB.js";

const isHex24 = (value) => typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

async function migrateIngredientIds({ apply }) {
  await connectMongoDB();
  const db = mongoose.connection.db;
  const ingredientsCollection = db.collection("ingredients");
  const recipesCollection = db.collection("recipes");

  const legacyIngredients = await ingredientsCollection
    .find({ _id: { $type: "string" } })
    .toArray();

  const insertOps = [];
  const deleteIds = [];
  const skipped = [];

  for (const doc of legacyIngredients) {
    if (!isHex24(doc._id)) {
      skipped.push({ _id: doc._id, name: doc.name });
      continue;
    }
    insertOps.push({ ...doc, _id: new mongoose.Types.ObjectId(doc._id) });
    deleteIds.push(doc._id);
  }

  console.log(`Ingredients with string _id: ${legacyIngredients.length}`);
  console.log(`Ingredients to convert: ${insertOps.length}`);
  console.log(`Skipped (non hex24 _id): ${skipped.length}`);
  if (skipped.length) console.log(skipped);

  const recipes = await recipesCollection
    .find({ "ingredients.ingredient": { $type: "string" } })
    .toArray();

  const recipeOps = [];
  for (const recipe of recipes) {
    const newIngredients = recipe.ingredients.map((item) =>
      isHex24(item.ingredient)
        ? { ...item, ingredient: new mongoose.Types.ObjectId(item.ingredient) }
        : item,
    );
    recipeOps.push({
      updateOne: {
        filter: { _id: recipe._id },
        update: { $set: { ingredients: newIngredients } },
      },
    });
  }

  console.log(`Recipes with string ingredient refs: ${recipes.length}`);

  if (!apply) {
    console.log("Dry run only — no changes written. Re-run with --apply to write changes.");
    await mongoose.disconnect();
    return;
  }

  if (insertOps.length) {
    await ingredientsCollection.insertMany(insertOps);
    const deleteResult = await ingredientsCollection.deleteMany({ _id: { $in: deleteIds } });
    console.log(`Ingredients inserted: ${insertOps.length}, old string-id docs removed: ${deleteResult.deletedCount}`);
  }

  if (recipeOps.length) {
    const result = await recipesCollection.bulkWrite(recipeOps);
    console.log(`Recipes updated: ${result.modifiedCount}`);
  }

  await mongoose.disconnect();
}

const apply = process.argv.includes("--apply");
migrateIngredientIds({ apply }).catch((error) => {
  console.error(error);
  process.exit(1);
});
