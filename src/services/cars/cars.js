import createHttpError from 'http-errors';
import { Car } from '../../db/models/car.js';
import { saveFileToLocalFolder } from '../../utils/saveFileToLocalFolder.js';
import fs from 'node:fs/promises';
import { deleteFile } from '../../utils/deleteFile.js';
// import { saveToCloudinary } from '../../utils/saveToCloudinary.js';

const createPaginationInformation = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const createCar = async ({ body, user, file }) => {
  const myCar = await Car.findOne({ carNumber: body.carNumber });
  const { url, filePath } = await saveFileToLocalFolder(file);
  // ----------------------------------------------
  // const url = await saveToCloudinary(file);
  // ----------------------------------------------

  if (myCar) {
    await fs.unlink(filePath);
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
  const { url } = await saveFileToLocalFolder(payload.file);

  const car = await Car.findOne({ _id: id });
  if (!car) {
    throw createHttpError(404, 'Car was not found.');
  }

  const oldUrl = car.carPhotoURL;
  const photoUrl = url === null ? oldUrl : url;

  const updateCar = await Car.findByIdAndUpdate(
    { _id: id },
    {
      ...payload.body,
      carPhotoURL: photoUrl,
      author: payload.user.id,
    },
    {
      new: true,
    },
  );

  if (url !== null) {
    await deleteFile(oldUrl);
  }

  return updateCar;
};

export const getAllCars = async ({ page = 1, perPage = 2, owner }) => {
  const skip = perPage * (page - 1);

  const [carsCount, cars] = await Promise.all([
    Car.find().countDocuments(),
    Car.find({ owner }).skip(skip).limit(perPage),
  ]);

  const paginationInformation = createPaginationInformation(
    page,
    perPage,
    carsCount,
  );

  return {
    cars,
    ...paginationInformation,
  };
};

export const getOneCar = async (id) => {
  const car = await Car.findById({ _id: id });

  if (!car) {
    throw createHttpError(401, 'Car was not found');
  }

  return car;
};

export const deleteCar = async (id) => {
  const car = await Car.findOne({ _id: id });
  if (!car) {
    throw createHttpError(404, 'Car was not found.');
  }
  await deleteFile(car.carPhotoURL);

  await Car.findByIdAndDelete({ _id: id });
};
