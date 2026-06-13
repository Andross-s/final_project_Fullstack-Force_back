import createRecipe from '../../services/recipes.js';

export const createRecipeController = async (req, res) => {
  const recipe = await createRecipe({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Recipe created successfully',
    data: recipe,
  });
};