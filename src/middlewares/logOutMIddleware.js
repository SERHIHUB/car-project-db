import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';

export const logOutMiddleware = async (req, res, next) => {
  const id = req.user.id;
  const token = req.user.token;

  const currentUser = await User.findById(id);

  if (currentUser === null) {
    throw createHttpError(401, 'Invalid token!');
  }

  if (currentUser.token !== token) {
    throw createHttpError(401, 'Invalid token.');
  }

  next();
};
