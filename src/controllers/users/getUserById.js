import createHttpError from 'http-errors';
import { User } from '../../models/user.js';

export const getUserById = async (req, res) => {
  const { userId } = req.params;

 console.log('PARAMS:', req.params);

  const user = await User.findById(userId);

    console.log('USER:', user);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found current user',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following,
    },
  });
};