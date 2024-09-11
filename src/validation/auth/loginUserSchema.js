import joi from 'joi';

export const loginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(4).max(10),
});
