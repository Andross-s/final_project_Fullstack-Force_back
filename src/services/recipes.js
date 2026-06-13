import  Recipe  from '../models/recipe';

export const createRecipe = async (payload) => {
  return await Recipe.create(payload);
};