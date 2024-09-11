import {
  // createUser,
  deleteUser,
  getOneUser,
  getUsers,
  upsertUser,
} from '../../services/users/users.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';

export const getUsersController = async (req, res) => {
  const owner = req.user.owner;

  // const users = await getUsers();
  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getUsers({ page, perPage, owner });

  res.status(200).json({
    status: 200,
    message: 'Successfully get all users',
    data: users,
  });
};

export const getOneUserController = async (req, res) => {
  const id = req.params.userId;
  const user = await getOneUser(id);

  res.status(200).json({
    status: 200,
    message: `Successfully get user by ${id}`,
    data: user,
  });
};

// export const createUserController = async (req, res) => {
//   const { body } = req;
//   const createNewUser = await createUser(body);

//   res.status(201).json({
//     status: 201,
//     message: `Successfully created new user`,
//     data: createNewUser,
//   });
// };

export const patchUserController = async (req, res) => {
  const id = req.params.userId;
  const { body } = req;
  const { user } = await upsertUser(id, body);
  // const user = upsertUser(id, body);

  res.status(200).json({
    status: 200,
    message: `Successfully update user`,
    data: user,
  });
};

export const updateUserController = async (req, res) => {
  const id = req.params.userId;
  const { body } = req;

  const { isNew, user } = await upsertUser(id, body, { upsert: true });

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
