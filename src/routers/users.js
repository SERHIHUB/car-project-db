import { Router } from 'express';
import {
  // createUserController,
  deleteUserController,
  patchUserController,
  getOneUserController,
  getUsersController,
  updateUserController,
} from '../controllers/users/usersControllers.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { auditTokenMiddleware } from '../middlewares/auditTokenMiddleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema } from '../validation/user/createUserSchema.js';
import { updateUserSchema } from '../validation/user/updateUserSchema.js';
import { auditAccessUser } from '../middlewares/auditAccessUser.js';

const userRouter = Router();

// userRouter.use('/:userId', validateMongoId('userId'));

userRouter.get('/', auditTokenMiddleware, ctrlWrapper(getUsersController));

userRouter.get(
  '/:userId',
  auditTokenMiddleware,
  validateMongoId('userId'),
  ctrlWrapper(getOneUserController),
);

// userRouter.post(
//   '/',
//   validateBody(createUserSchema),
//   ctrlWrapper(createUserController),
// );

userRouter.patch(
  '/:userId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessUser),
  // auditAccessUser,
  validateMongoId('userId'),
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController),
);

userRouter.put(
  '/:userId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessUser),
  // auditAccessUser,
  validateMongoId('userId'),
  validateBody(createUserSchema),
  ctrlWrapper(updateUserController),
);

userRouter.delete(
  '/:userId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessUser),
  // auditAccessUser,
  validateMongoId('userId'),
  ctrlWrapper(deleteUserController),
);

export default userRouter;
