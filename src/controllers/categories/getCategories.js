import { Categories } from "../../models/category.js";

export const getCategories = async (req, res, next) => {
	try {
		const categories = await Categories.find({}).select("-__v");
		res.json(categories);
	} catch (err) {
		next(err);
	}
};