import { User } from "../../models/user.js";

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("favorites");
    return res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};
