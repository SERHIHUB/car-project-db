import joi from 'joi';

export const registerUserSchema = joi.object({
  name: joi.string().required().min(3).max(20),
  email: joi.string().email().required(),
  password: joi.string().required().min(4).max(10),
  token: joi.string(),
  role: joi.string(),
  thema: joi.string(),
  owner: joi.string(),
  verifyToken: joi.string(),
});
