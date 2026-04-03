import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repository/auth.repository.js';
import { UnAuthorizedException } from '../types/errors.js';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser.length) {
    throw new UnAuthorizedException('Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUser(name, email, hashedPassword);
};

export const loginUser = async (email: string, password: string) => {
  const users = await findUserByEmail(email);
  const user = users?.[0];

  const isPasswordValid = await bcrypt.compare(password, user.password || '');

  if (!user || !isPasswordValid) {
    throw new UnAuthorizedException('Invalid email or password.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
