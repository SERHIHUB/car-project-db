import { Router } from 'express';
import {
  loginUserController,
  logOutUserController,
  registerUserController,
  requestResetPasswordController,
  resetPasswordController,
  verifyToken,
} from '../controllers/users/authControllers.js';
import { auditTokenMiddleware } from '../middlewares/auditTokenMiddleware.js';
import { logOutMiddleware } from '../middlewares/logOutMIddleware.js';
import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema } from '../validation/auth/loginUserSchema.js';
import { registerUserSchema } from '../validation/auth/registerUserShema.js';
import { resetPasswordSchema } from '../validation/auth/resetPasswordSchema.js';
import { sendResetPasswordSchema } from '../validation/auth/sendResetPasswordSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  upload.single('avatar'),
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// authRouter.post('/refresh-token');

authRouter.post(
  '/logout',
  auditTokenMiddleware,
  ctrlWrapper(logOutMiddleware),
  ctrlWrapper(logOutUserController),
);

authRouter.post(
  '/request-reset-password',
  validateBody(sendResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.get('/verify/:token', verifyToken);

export default authRouter;
