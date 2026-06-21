import { Categories } from "../../models/category.js";

export const getCategories = async (req, res, next) => {
	try {
		const categories = await Categories.find({}).select("-__v");

		if (categories.length === 0) {
			return res.status(404).json({ message: "Categories not found" });
		}

		res.status(200).json(categories);
	} catch (err) {
		next(err);
	}
};