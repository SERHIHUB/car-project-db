import joi from 'joi';

export const resetPasswordSchema = joi.object({
  password: joi.string().required().min(4).max(10),
  token: joi.string().required(),
});
