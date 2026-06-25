import Recipe from '../../models/recipe.js';
import createHttpError from 'http-errors';
import { escapeRegExp } from '../../utils/escapeRegExp.js';

export const getOwnerRecipes = async (req, res) => {

    const {
        page = 1,
        perPage = 12,
        category,
        search,
    } = req.query;
    const skip = (page - 1) * perPage;
    const limit = perPage;

    // пошук рецепта за ID поточного залогіненого користувача
    const recipesQuery = Recipe.find({
        owner: req.user._id,
    });

    // пошук за категорією
    if (category) {
        recipesQuery.where("category").equals(category);
    }

    // пошук за пошуковим запитом
    if (search) {
        recipesQuery.where({
            title: { $regex: escapeRegExp(search), $options: "i" },
        });
    }

    const [totalRecipes, recipes] = await Promise.all([
        recipesQuery.clone().countDocuments(),
        recipesQuery
            .skip(skip)
            .limit(limit)
            .populate("ingredients.ingredient")
            .populate("category"),
    ]);

    const totalPages = Math.ceil(totalRecipes / limit);

    // відповідь
    res.status(200).json({
        page: Number(page),
        perPage: Number(perPage),
        totalRecipes,
        totalPages,
        recipes,
    });
};