import createHttpError from 'http-errors';

export const auditRoleMiddleware = (req, res, next) => {
  const role = req.user.role;

  if (role === 'observer') {
    throw createHttpError(403, 'No access, role is not correct.');
  }

  next();
};
