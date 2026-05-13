import {
  deleteUserById,
  findAllUsers,
  findPamphletsByuser_id,
  findUserById,
  updateUserById,
} from '../repository/users.repository.js';

export const getUsers = async () => await findAllUsers();

export const getUsersById = async (id: number) => await findUserById(id);

export const updateUser = async (
  id: number,
  data: { name?: string; email?: string },
) => await updateUserById(id, data);

export const deleteUser = async (id: number) => await deleteUserById(id);

export const getPamphletsByuser_id = async (user_id: number) => {
  return await findPamphletsByuser_id(user_id);
};
