import joi from 'joi';

export const updateContactSchema = joi.object({
  name: joi.string(),
  number: joi.string(),
  owner: joi.string(),
  department: joi.string(),
});
