import { findAllUsers, findUserById } from '../repository/users.repository.js';

export const getUsers = async () => await findAllUsers();

export const getUsersById = async (id: number) => await findUserById(id);
