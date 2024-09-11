import joi from 'joi';

export const createContactSchema = joi.object({
  name: joi.string().required(),
  number: joi.string().required(),
  owner: joi.string(),
  department: joi.string(),
});
