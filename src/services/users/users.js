import createHttpError from 'http-errors';
import { User } from '../../db/models/user.js';
import bcrypt from 'bcrypt';
// import { saveFileToLocalFolder } from '../../utils/saveFileToLocalFolder.js';
// import { deleteFile } from '../../utils/deleteFile.js';
import { saveToCloudinary } from '../../utils/saveToCloudinary.js';
import { deleteCloudinaryFile } from '../../utils/deleteCloudinaryFile.js';

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
};

export const getOneUser = async (id) => {
  const user = await User.findById({ _id: id });

  if (!user) {
    throw createHttpError(404, 'User was not found!');
  }

  return user;
};

export const getCurrentUser = async (token) => {
  if (!token) {
    throw createHttpError(401, 'Current token is missing.');
  }

  const user = await User.findOne({ token: token });

  if (!user) {
    throw createHttpError(404, 'Current user was not found.');
  }

  return user;
};

export const upsertUser = async (id, { body, file }, options = {}) => {
  // const { url, filePath } = await saveFileToLocalFolder(file);
  const { url } = await saveToCloudinary(file);

  const userById = await User.findOne({ _id: id });
  if (!userById) {
    throw createHttpError(404, 'User was not found.');
  }

  if (url && userById.avatarURL) {
    await deleteCloudinaryFile(userById.avatarURL);
  }

  const oldUrl = userById.avatarURL;
  const photoUrl = url === null ? oldUrl : url;

  const hashedPassword =
    body.password && (await bcrypt.hash(body.password, 10));

  const credentialsObj = body.password
    ? { ...body, password: hashedPassword, avatarURL: photoUrl }
    : { ...body, avatarURL: photoUrl };

  const rawResult = await User.findByIdAndUpdate({ _id: id }, credentialsObj, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'User was not found.');
  }

  return {
    user: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteUser = async (id) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw createHttpError(404, 'User was not found.');
  }

  if (user.avatarURL) {
    await deleteCloudinaryFile(user.avatarURL);
  }

  const response = await User.findByIdAndDelete({ _id: id });

  return response;
  // await User.findByIdAndDelete({ _id: id });
};
