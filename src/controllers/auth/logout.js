import { User } from "../../models/user.js";

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.clearCookie("refreshToken");

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
