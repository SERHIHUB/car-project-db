import { Router } from 'express';
import {
  createCarController,
  deleteCarController,
  getCarsController,
  getOneCarController,
  updateCarController,
} from '../controllers/cars/carsControllers.js';
import { auditAccessCars } from '../middlewares/auditAccessCars.js';
import { auditRoleMiddleware } from '../middlewares/auditRoleMiddleware.js';
import { auditTokenMiddleware } from '../middlewares/auditTokenMiddleware.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createCarSchema } from '../validation/cars/createCarSchema.js';
import { updateCarSchema } from '../validation/cars/updateCarSchema.js';

const carRouter = Router();

carRouter.post(
  '/',
  auditTokenMiddleware,
  // ctrlWrapper(auditAccessCars),
  auditRoleMiddleware,
  validateBody(createCarSchema),
  ctrlWrapper(createCarController),
);

carRouter.get('/', auditTokenMiddleware, ctrlWrapper(getCarsController));

carRouter.get(
  '/:carId',
  auditTokenMiddleware,
  validateMongoId('carId'),
  ctrlWrapper(getOneCarController),
);

carRouter.patch(
  '/:carId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessCars),
  // auditRoleMiddleware,
  validateMongoId('carId'),
  validateBody(updateCarSchema),
  ctrlWrapper(updateCarController),
);

carRouter.delete(
  '/:carId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessCars),
  // auditRoleMiddleware,
  validateMongoId('carId'),
  ctrlWrapper(deleteCarController),
);

export default carRouter;
