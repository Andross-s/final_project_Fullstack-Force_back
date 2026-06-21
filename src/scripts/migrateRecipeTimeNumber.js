import "dotenv/config";
import mongoose from "mongoose";
import { connectMongoDB } from "../db/connectMongoDB.js";

async function migrateRecipeTime({ apply }) {
  await connectMongoDB();
  const recipesCollection = mongoose.connection.db.collection("recipes");

  const legacyRecipes = await recipesCollection
    .find({ time: { $type: "string" } })
    .toArray();

  const ops = [];
  const unparsable = [];

  for (const recipe of legacyRecipes) {
    const numericTime = Number(recipe.time);
    if (Number.isNaN(numericTime)) {
      unparsable.push({ _id: recipe._id, title: recipe.title, time: recipe.time });
      continue;
    }
    ops.push({
      updateOne: {
        filter: { _id: recipe._id },
        update: { $set: { time: numericTime } },
      },
    });
  }

  console.log(`Recipes with string time: ${legacyRecipes.length}`);
  console.log(`Recipes to fix: ${ops.length}`);
  console.log(`Unparsable (skipped): ${unparsable.length}`);
  if (unparsable.length) console.log(unparsable);

  if (!apply) {
    console.log("Dry run only — no changes written. Re-run with --apply to write changes.");
  } else if (ops.length) {
    const result = await recipesCollection.bulkWrite(ops);
    console.log(`Applied. Modified: ${result.modifiedCount}`);
  } else {
    console.log("Nothing to apply.");
  }

  await mongoose.disconnect();
}

const apply = process.argv.includes("--apply");
migrateRecipeTime({ apply }).catch((error) => {
  console.error(error);
  process.exit(1);
});
