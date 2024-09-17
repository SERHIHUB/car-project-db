import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';

export const auditAccessUser = async (req, res, next) => {
  const id = req.params.userId;
  const { owner, role } = req.user;

  if (role === 'observer') {
    throw createHttpError(403, 'No access, role is not correct.');
  }

  const user = await User.findOne({ _id: id });

  if (user === null) {
    throw createHttpError(404, 'User was not found.');
  }

  if (user.owner !== owner) {
    throw createHttpError(403, 'No access, owner is not correct.');
  }

  next();
};