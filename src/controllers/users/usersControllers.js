import {
  deleteUser,
  getOneUser,
  getUsers,
  upsertUser,
} from '../../services/users/users.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';

export const getUsersController = async (req, res) => {
  const owner = req.user.owner;

  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getUsers({ page, perPage, owner });

  res.status(200).json({
    status: 200,
    message: 'Successfully get all users',
    data: users,
  });
};

export const getOneUserController = async (req, res) => {
  const id = req.user.id;
  const user = await getOneUser(id);

  res.status(200).json({
    status: 200,
    message: `Successfully get user by ${id}`,
    data: user,
  });
};

export const patchUserController = async (req, res) => {
  const id = req.params.userId;
  const { body, file } = req;
  const { user } = await upsertUser(id, { body: body, file: file });

  res.status(200).json({
    status: 200,
    message: `Successfully update user`,
    data: user,
  });
};

export const updateUserController = async (req, res) => {
  const id = req.params.userId;
  const { body, file } = req;

  const { isNew, user } = await upsertUser(
    id,
    { body: body, file: file },
    { upsert: true },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Successfully upserted user.',
    data: user,
  });
};

export const deleteUserController = async (req, res) => {
  const id = req.params.userId;

  await deleteUser(id);

  res.status(204).send();
};
