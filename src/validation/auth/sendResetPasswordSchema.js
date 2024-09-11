import joi from 'joi';

export const sendResetPasswordSchema = joi.object({
  email: joi.string().email().required(),
});
