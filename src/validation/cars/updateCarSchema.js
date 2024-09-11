import joi from 'joi';

export const updateCarSchema = joi.object({
  carModel: joi.string().min(3).max(20),
  carNumber: joi.string().min(4).max(8),
  price: joi.string().min(3).max(5),
  paymentDate: joi.string(),
  contact: joi.string(),
  owner: joi.string(),
  author: joi.string(),
  // isPaid: joi.boolean(),
});
