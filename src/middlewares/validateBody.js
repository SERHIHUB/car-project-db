import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const messages = error.details;
    const err = createHttpError(400, 'Bad request', {
      errors: messages.map((message) => message.message),
    });
    next(err);
  }
};
