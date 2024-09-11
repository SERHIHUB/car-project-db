import createHttpError from 'http-errors';
import { Car } from '../../db/models/car.js';

export const createCar = async ({ body, user }) => {
  const myCar = await Car.findOne({ carNumber: body.carNumber });

  if (myCar) {
    throw createHttpError(409, 'This car is already listed');
  }

  const newCar = await Car.create({
    ...body,
    owner: user.owner,
    author: user.id,
  });

  return newCar;
};

export const editCar = async (id, payload) => {
  const updateCar = await Car.findByIdAndUpdate(
    { _id: id },
    {
      ...payload.body,
      author: payload.user.id,
    },
    {
      new: true,
    },
  );

  return updateCar;
};

export const getAllCars = async (owner) => {
  const cars = await Car.find({ owner: owner });

  return cars;
};

export const getOneCar = async (id) => {
  const car = await Car.findById({ _id: id });

  if (!car) {
    throw createHttpError(401, 'Car was not found');
  }

  return car;
};

export const deleteCar = async (id) => {
  await Car.findByIdAndDelete({ _id: id });
};
