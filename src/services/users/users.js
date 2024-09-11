import createHttpError from 'http-errors';
import { User } from '../../db/models/user.js';
import bcrypt from 'bcrypt';

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

export const getUsers = async ({ page = 1, perPage = 4, owner }) => {
  const skip = perPage * (page - 1);
  // const usersCount = await User.find().countDocuments();
  // const users = await User.find().skip(skip).limit(perPage);

  const [usersCount, users] = await Promise.all([
    User.find().countDocuments(),
    User.find({ owner }).skip(skip).limit(perPage),
  ]);

  const paginationInformation = createPaginationInformation(
    page,
    perPage,
    usersCount,
  );

  return {
    users,
    ...paginationInformation,
  };
  // return users;
};

export const getOneUser = async (id) => {
  const user = await User.findById({ _id: id });

  if (!user) {
    throw createHttpError(404, 'User was not found!');
  }

  return user;
};

export const upsertUser = async (id, credentials, options = {}) => {
  // const hashedPassword = await bcrypt.hash(credentials.password, 10);

  // console.log(credentials);

  const hashedPassword =
    credentials.password && (await bcrypt.hash(credentials.password, 10));

  const credentialsObj = credentials.password
    ? { ...credentials, password: hashedPassword }
    : { ...credentials };

  const rawResult = await User.findByIdAndUpdate({ _id: id }, credentialsObj, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  // const rawResult = await User.findByIdAndUpdate(
  //   { _id: id },
  //   {
  //     ...credentials,
  //     password: hashedPassword,
  //   },
  //   {
  //     new: true,
  //     includeResultMetadata: true,
  //     ...options,
  //   },
  // );

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'User was not found.');
  }

  return {
    user: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

// export const verifyUserToken = async () => {
//   console.log('Verify');
// };

export const deleteUser = async (id) => {
  await User.findByIdAndDelete({ _id: id });
};
