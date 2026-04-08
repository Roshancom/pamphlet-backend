import {
  deleteUserById,
  findAllUsers,
  findPamphletsByUserId,
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

export const getPamphletsByUserId = async (userId: number) => {
  return await findPamphletsByUserId(userId);
};
