import joi from 'joi';

export const updateUserSchema = joi.object({
  name: joi.string().min(3).max(20),
  email: joi.string().email(),
  password: joi.string().min(4).max(10),
  token: joi.string(),
  role: joi.string(),
  thema: joi.string(),
  owner: joi.string(),
});
