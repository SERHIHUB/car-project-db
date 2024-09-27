import createHttpError from 'http-errors';
import { Car } from '../../db/models/car.js';
import { saveFileToLocalFolder } from '../../utils/saveFileToLocalFolder.js';
import fs from 'node:fs/promises';
import { deleteFile } from '../../utils/deleteFile.js';
import { deleteFileIfRepeat } from '../../utils/deleteFileIfRepeat.js';
import { abonementIsActive } from '../../utils/abonementIsActive.js';
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

  // console.log(body);

  if (myCar) {
    // await fs.unlink(filePath);
    await deleteFileIfRepeat(filePath);
    throw createHttpError(409, 'This car is already listed');
  }

  // ----------------------------------------------
  // const url = await saveToCloudinary(file);
  // ----------------------------------------------

  // console.log(filePath);

  // if (myCar) {
  //   await fs.unlink(filePath);
  //   deleteFileIfRepeat(filePath);
  //   throw createHttpError(409, 'This car is already listed');
  // }

  // console.log(filePath);

  // if (myCar) {
  //   try {
  //     await fs.unlink(filePath);
  //     console.log('delete file');
  //   } catch (error) {
  //     console.log('URL was not found.');
  //     console.log(filePath);
  //   }
  //   throw createHttpError(409, 'This car is already listed');
  // }

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

  // ------

  const oldUrl = car.carPhotoURL;
  const photoUrl = url === null ? oldUrl : url;

  // _________________________________________________________________

  const currentPaidMonth = abonementIsActive({
    dayOfPaid: car.lastPaidDate,
    lastUpdateDate: car.updatedAt,
  });

  // const currentPaidMonth = 8;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  const isCarPaid = currentMonth <= currentPaidMonth;

  // console.log(currentPaidMonth);
  // console.log(isCarPaid);

  const editCarObject = payload.body.lastPaidDate
    ? {
        ...payload.body,
        carPhotoURL: photoUrl,
        author: payload.user.id,
        isPaid: isCarPaid,
        isPaidMonth: currentPaidMonth,
      }
    : {
        ...payload.body,
        carPhotoURL: photoUrl,
        author: payload.user.id,
        isPaid: isCarPaid,
      };
  // _________________________________________________________________

  // const oldUrl = car.carPhotoURL;
  // const photoUrl = url === null ? oldUrl : url;

  const updateCar = await Car.findByIdAndUpdate(
    { _id: id },
    // {
    //   ...payload.body,
    //   carPhotoURL: photoUrl,
    //   author: payload.user.id,
    //   isPaidMonth: currentPaidMonth,
    // },
    editCarObject,
    {
      new: true,
    },
  );

  if (url !== null) {
    await deleteFile(oldUrl);
  }

  return updateCar;
};

export const getAllCars = async ({
  page = 1,
  perPage = 2,
  filter = {},
  owner,
}) => {
  const skip = perPage * (page - 1);

  const carsQuery = Car.find({ owner });

  if (filter.paid) {
    carsQuery.where('isPaid').equals(filter.paid);
  }
  if (!filter.paid) {
    carsQuery.where('isPaid').equals(filter.paid);
  }

  const [carsCount, cars] = await Promise.all([
    Car.find().merge(carsQuery).countDocuments(),
    carsQuery.skip(skip).limit(perPage).exec(),
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

  // abonementIsActive(car.paidDate);

  // const myDate = new Date(car.paidDate);

  // console.log(myDate.getMonth() + 1);

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
