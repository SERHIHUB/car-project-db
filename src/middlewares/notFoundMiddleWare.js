export const notFoundMiddleWare = (req, res) => {
  res.status(404).send('Route was not found.');
};
