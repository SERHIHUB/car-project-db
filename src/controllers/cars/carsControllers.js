import {
  createCar,
  deleteCar,
  editCar,
  getAllCars,
  getOneCar,
} from '../../services/cars/cars.js';
import { parseFilters } from '../../utils/parseFilters.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';

export const getCarsController = async (req, res) => {
  const owner = req.user.owner;

  const filter = parseFilters(req.query);

  const { page, perPage } = parsePaginationParams(req.query);

  const cars = await getAllCars({ page, perPage, filter, owner });

  res.status(200).json({
    status: 200,
    message: 'Successfully get all cars.',
    data: cars,
  });
};

export const getOneCarController = async (req, res) => {
  const id = req.params.carId;
  const car = await getOneCar(id);

  res.status(200).json({
    status: 200,
    message: 'Successfully get one car.',
    data: car,
  });
};

export const createCarController = async (req, res) => {
  const { body, file } = req;
  const user = req.user;

  const newCar = await createCar({ body: body, user: user, file: file });

  res.status(201).json({
    status: 201,
    message: 'Successfully created new car.',
    data: newCar,
  });
};

export const updateCarController = async (req, res) => {
  const id = req.params.carId;
  const { body, file } = req;
  const user = req.user;

  const newEditCar = await editCar(id, { body: body, user: user, file: file });

  // _______________________________________________________________

  // const paidMonth = ('Month: ', newEditCar.updatedAt.getMonth());

  // console.log(paidMonth);
  // const time = new Date();
  // const newTime = new Date('2024-09-26T17:54:12.001Z');

  // console.log(newEditCar.updatedAt);

  // console.log(newTime);

  // console.log(Date.now());

  // console.log(new Date());

  // console.log(newTime.getFullYear());

  // console.log(newTime.getMonth());

  // console.log(newTime.getDay());

  // ________________________________________________________________

  res.status(200).json({
    status: 200,
    message: 'Successfully updated car.',
    data: newEditCar,
  });
};

export const deleteCarController = async (req, res) => {
  const id = req.params.carId;

  await deleteCar(id);

  res.status(204).send();
};
