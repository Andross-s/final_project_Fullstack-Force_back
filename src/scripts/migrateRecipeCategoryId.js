import "dotenv/config";
import mongoose from "mongoose";
import { connectMongoDB } from "../db/connectMongoDB.js";
import { Categories } from "../models/category.js";

const isObjectIdString = (value) => value != null && mongoose.Types.ObjectId.isValid(value);

export async function buildCategoryNameMap() {
  const categories = await Categories.find({}).lean();
  const map = new Map();
  for (const category of categories) {
    map.set(category.name.trim().toLowerCase(), category._id);
  }
  return map;
}

export function resolveCategoryId(categoryValue, categoryNameMap) {
  if (isObjectIdString(categoryValue)) {
    return { id: categoryValue, resolved: true };
  }
  const id = categoryNameMap.get(String(categoryValue ?? "").trim().toLowerCase());
  return { id: id ?? null, resolved: Boolean(id) };
}

function normalizeIngredients(ingredients) {
  return ingredients.map((item) => ({
    ingredient: item.ingredient ?? item.id,
    amount: item.amount ?? item.measure,
  }));
}

async function migrateRecipes({ apply }) {
  await connectMongoDB();
  const recipesCollection = mongoose.connection.db.collection("recipes");
  const categoryNameMap = await buildCategoryNameMap();

  const ops = [];
  const unresolved = [];
  let scanned = 0;

  const cursor = recipesCollection.find({});
  for await (const doc of cursor) {
    scanned++;

    const needsCategoryFix = !isObjectIdString(doc.category);
    const needsIngredientsFix =
      Array.isArray(doc.ingredients) && doc.ingredients.some((item) => item.id || item.measure);

    if (!needsCategoryFix && !needsIngredientsFix) continue;

    const update = {};

    if (needsCategoryFix) {
      const { id, resolved } = resolveCategoryId(doc.category, categoryNameMap);
      if (!resolved) {
        unresolved.push({ _id: doc._id, title: doc.title, category: doc.category });
        continue;
      }
      update.category = id;
    }

    if (needsIngredientsFix) {
      update.ingredients = normalizeIngredients(doc.ingredients);
    }

    ops.push({ updateOne: { filter: { _id: doc._id }, update: { $set: update } } });
  }

  console.log(`Recipes scanned: ${scanned}`);
  console.log(`Recipes to fix: ${ops.length}`);
  console.log(`Unresolved category names (skipped): ${unresolved.length}`);
  if (unresolved.length) {
    console.log(unresolved);
  }

  if (!apply) {
    console.log("Dry run only — no changes written. Re-run with --apply to write changes.");
  } else if (ops.length) {
    const result = await recipesCollection.bulkWrite(ops);
    console.log(`Applied. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } else {
    console.log("Nothing to apply.");
  }

  await mongoose.disconnect();
}

const apply = process.argv.includes("--apply");
migrateRecipes({ apply }).catch((error) => {
  console.error(error);
  process.exit(1);
});
