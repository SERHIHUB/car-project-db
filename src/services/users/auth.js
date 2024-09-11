import { User } from '../../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import jwt, { decode } from 'jsonwebtoken';
import { env } from '../../utils/env.js';
import { ENV_VARS } from '../../constants/index.js';
import { sendMail } from '../../utils/sendMail.js';

export const createUser = async (credentials) => {
  const hashedPassword = await bcrypt.hash(credentials.password, 10);
  const yourVerifyToken = crypto.randomUUID();

  const email = credentials.email;

  const user = await User.findOne({ email: credentials.email });

  if (user) {
    throw createHttpError(409, 'This user already exists.');
  }

  const owner = await User.findOne({ email: credentials.owner });

  // const metaEmail = `serhii.24@meta.ua`;

  if (owner) {
    const newUser = await User.create({
      ...credentials,
      owner: owner._id,
      password: hashedPassword,
      verifyToken: yourVerifyToken,
    });

    try {
      await sendMail({
        to: email,
        from: env(ENV_VARS.SMTP_SEND_FROM_USER),
        subject: 'Verify.',
        html: `
        <h1>Hello!</h1>
        <p>
        To confirm your email please clik on the <a href="${env(
          ENV_VARS.FRONTEND_HOST,
        )}/auth/verify/${yourVerifyToken}">Link</a></p>`,
        text: `To confirm your email please open the link ${env(
          ENV_VARS.FRONTEND_HOST,
        )}/auth/verify/${yourVerifyToken}`,
      });
    } catch (error) {
      console.log(error);
      createHttpError(500, 'Problem with sending emails.');
    }
    return newUser;
  }

  await User.create({
    ...credentials,
    password: hashedPassword,
    verifyToken: yourVerifyToken,
  });

  // ----------------------------------------------------------------------

  await sendMail({
    to: email,
    from: env(ENV_VARS.SMTP_SEND_FROM_USER),
    subject: 'Verify your email.',
    html: `
    <h1>Hello!</h1>
    <p>
    To confirm your email please clik on the <a href="${env(
      ENV_VARS.FRONTEND_HOST,
    )}/auth/verify/${yourVerifyToken}">Link</a></p>`,
    text: `To confirm your email please open the link ${env(
      ENV_VARS.FRONTEND_HOST,
    )}/auth/verify/${yourVerifyToken}`,
  });

  // ----------------------------------------------------------------------

  const iAmOwner = await User.findOne({ email: credentials.email });

  return await User.findOneAndUpdate(
    { email: credentials.email },
    {
      ...credentials,
      owner: iAmOwner._id,
      role: 'admin',
      password: hashedPassword,
    },
  );
};

export const logInUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    // throw createHttpError(404, 'User not found.');
    throw createHttpError(401, 'Email or password invalid.');
  }

  const areEqual = await bcrypt.compare(password, user.password);

  if (!areEqual) {
    throw createHttpError(401, 'Email or password invalid.');
  }

  if (user.verify === false) {
    throw createHttpError(401, 'Please verify your email.');
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      // email: user.email,
      owner: user.owner,
      role: user.role,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '14h',
    },
  );

  await User.findByIdAndUpdate(user._id, { token });

  // const accessToken = crypto.randomBytes(10).toString('base64');
  // const refreshToken = crypto.randomBytes(10).toString('base64');

  // return { accessToken, refreshToken };
  return { token };
};

export const logOutUser = async (id) => {
  return await User.findByIdAndUpdate(id, { token: null });
};

export const verifyUserToken = async (token) => {
  const user = await User.findOne({ verifyToken: token });

  if (!user) {
    createHttpError(404, 'User was not found.');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verifyToken: null,
  });
};

export const sendResetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    createHttpError(404, 'User was not found.');
  }

  // console.log(user);

  const token = jwt.sign(
    // {
    //   id: user._id,
    //   email,
    // },
    {
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '14h',
    },
  );

  // const metaEmail = `serhii.24@meta.ua`;
  // const gmailEmail = `chokorik@gmail.com`;

  // <a href="${env(ENV_VARS.FRONTEND_HOST)}/reset-password?token=${token}"
  // Посилання на  сторінку з формою для ввода пароля

  try {
    await sendMail({
      to: email,
      from: env(ENV_VARS.SMTP_SEND_FROM_USER),
      subject: 'Reset your password.',
      html: `
    <h1>Hello!</h1>
    <p>
    Here is reset your password <a href="${env(
      ENV_VARS.FRONTEND_HOST,
    )}/auth/reset-password?token=${token}">Link</a></p>`,
      text: `Here is reset your password, please open the link ${env(
        ENV_VARS.FRONTEND_HOST,
      )}/auth/reset-password/${token}`,
    });
  } catch (error) {
    // console.log('oops!');
    console.log(error);
    createHttpError(500, 'Problem with sending emails.');
  }
};

export const resetPassword = async ({ password, token }) => {
  let tokenPayload;

  // console.log(password);

  try {
    tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    throw createHttpError(401, error.message);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // console.log(tokenPayload);

  await User.findOneAndUpdate(
    {
      email: tokenPayload.email,
    },
    {
      password: hashedPassword,
    },
  );
};
