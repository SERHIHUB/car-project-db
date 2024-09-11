import {
  createCar,
  deleteCar,
  editCar,
  getAllCars,
  getOneCar,
} from '../../services/cars/cars.js';

export const getCarsController = async (req, res) => {
  const owner = req.user.owner;
  const cars = await getAllCars(owner);

  // console.log(req.user);

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
  const body = req.body;
  const user = req.user;

  const newCar = await createCar({ body: body, user: user });

  res.status(201).json({
    status: 201,
    message: 'Successfully created new car.',
    data: newCar,
  });
};

export const updateCarController = async (req, res) => {
  const id = req.params.carId;
  const body = req.body;
  const user = req.user;

  const newEditCar = await editCar(id, { body: body, user: user });

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
