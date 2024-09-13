import createHttpError from 'http-errors';
import { Car } from '../../db/models/car.js';
import { saveFileToLocalFolder } from '../../utils/saveFileToLocalFolder.js';
// import { saveToCloudinary } from '../../utils/saveToCloudinary.js';

export const createCar = async ({ body, user, file }) => {
  const myCar = await Car.findOne({ carNumber: body.carNumber });
  const url = await saveFileToLocalFolder(file);
  // ----------------------------------------------
  // const url = await saveToCloudinary(file);
  // ----------------------------------------------

  if (myCar) {
    throw createHttpError(409, 'This car is already listed');
  }

  const newCar = await Car.create({
    ...body,
    owner: user.owner,
    author: user.id,
    carPhotoURL: url,
  });

  return newCar;
};

export const editCar = async (id, payload) => {
  const url = await saveFileToLocalFolder(payload.file);
  // ----------------------------------------------
  // const url = await saveToCloudinary(file);
  // ----------------------------------------------
  const updateCar = await Car.findByIdAndUpdate(
    { _id: id },
    {
      ...payload.body,
      carPhotoURL: url,
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
