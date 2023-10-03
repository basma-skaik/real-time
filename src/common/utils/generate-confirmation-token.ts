import { randomBytes } from 'crypto';

export const generateToken = (length: number = 32): string => {
  const token = randomBytes(length).toString('hex');
  return token;
};
