import createHttpError from 'http-errors';
import { Car } from '../db/models/car.js';

export const auditAccessCars = async (req, res, next) => {
  const id = req.params.carId;
  const { owner, role } = req.user;

  if (role === 'observer') {
    throw createHttpError(403, 'No access, role is not correct.');
  }

  const car = await Car.findOne({ _id: id });

  if (car === null) {
    throw createHttpError(404, 'Car was not found.');
  }

  if (car.owner !== owner) {
    throw createHttpError(403, 'No access, owner is not correct.');
  }

  next();
};
