import {
  createUser,
  logInUser,
  logOutUser,
  resetPassword,
  sendResetPassword,
  verifyUserToken,
} from '../../services/users/auth.js';

export const registerUserController = async (req, res, next) => {
  // 000000000000000000000000000000
  // console.log(req.body);

  const newUser = await createUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully created new user.',
    data: newUser,
  });
};

export const loginUserController = async (req, res, next) => {
  const user = await logInUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'User is logged in.',
    data: user,
  });
};

// export const refreshTokenController = async (req, res, next) => {};

export const logOutUserController = async (req, res, next) => {
  const id = req.user.id;

  await logOutUser(id);

  res.status(204).end();
};

export const requestResetPasswordController = async (req, res, next) => {
  await sendResetPassword(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email was successfully send.',
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password was reset successfully.',
    data: {},
  });
};

export const verifyToken = async (req, res, next) => {
  const { token } = req.params;

  await verifyUserToken(token);

  console.log(token);

  res.status(200).json({
    status: 200,
    message: 'Verify email was successfully.',
    data: {},
  });
};
