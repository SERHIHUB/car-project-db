import joi from 'joi';

export const createCarSchema = joi.object({
  carModel: joi.string().required().min(3).max(20),
  carNumber: joi.string().required().min(4).max(8),
  price: joi.string().required().min(3).max(5),
  paymentDate: joi.string().required(),
  contact: joi.string(),
  owner: joi.string(),
  author: joi.string(),
  // isPaid: joi.boolean(),
});
