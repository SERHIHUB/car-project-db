import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../constants/index.js';
import { env } from '../utils/env.js';

export const auditTokenMiddleware = (req, res, next) => {
  // const authorizationHeader = req.headers.authorization;
  const authorizationHeader = req.get('Authorization');

  if (typeof authorizationHeader === 'undefined') {
    throw createHttpError(401, 'Invalid token');
  }

  const [bearer, token] = authorizationHeader.split(' ', 2);

  if (bearer !== 'Bearer' || !token) {
    throw createHttpError(401, 'Invalid token.');
  }

  jwt.verify(token, env(ENV_VARS.JWT_SECRET), (err, decode) => {
    if (err) {
      throw createHttpError(401, 'Invalid token');
    }

    req.user = {
      id: decode.id,
      name: decode.name,
      owner: decode.owner,
      role: decode.role,
      token: token,
    };

    next();
  });
};
