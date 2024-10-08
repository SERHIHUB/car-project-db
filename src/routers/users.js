import { Router } from 'express';
import {
  deleteUserController,
  patchUserController,
  getOneUserController,
  getUsersController,
  updateUserController,
  currentUserController,
} from '../controllers/users/usersControllers.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { auditTokenMiddleware } from '../middlewares/auditTokenMiddleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema } from '../validation/user/createUserSchema.js';
import { updateUserSchema } from '../validation/user/updateUserSchema.js';
import { auditAccessUser } from '../middlewares/auditAccessUser.js';
import { auditAccessDeleteUser } from '../middlewares/auditAccessDeleteUser.js';
import { upload } from '../middlewares/upload.js';

const userRouter = Router();

userRouter.get('/', auditTokenMiddleware, ctrlWrapper(getUsersController));

userRouter.get(
  '/user',
  auditTokenMiddleware,
  // validateMongoId('userId'),
  ctrlWrapper(getOneUserController),
);

userRouter.get(
  '/current',
  auditTokenMiddleware,
  ctrlWrapper(currentUserController),
);

userRouter.patch(
  '/:userId',

  auditTokenMiddleware,
  // ctrlWrapper(auditAccessUser),
  validateMongoId('userId'),
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController),
);

userRouter.put(
  '/:userId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessUser),
  validateMongoId('userId'),
  upload.single('avatar'),
  validateBody(createUserSchema),
  ctrlWrapper(updateUserController),
);

userRouter.delete(
  '/:userId',
  auditTokenMiddleware,
  // ctrlWrapper(auditAccessDeleteUser),
  validateMongoId('userId'),
  ctrlWrapper(deleteUserController),
);

export default userRouter;
