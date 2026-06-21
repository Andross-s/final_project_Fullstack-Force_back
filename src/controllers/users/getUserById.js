import createHttpError from "http-errors";
import { User } from "../../models/user.js";

export const getUserById = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createHttpError(401, "Not authorized"));
    }

    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    return res.status(200).json({
      status: 200,
      message: "Successfully found current user",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
