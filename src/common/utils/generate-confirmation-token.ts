import { randomBytes } from 'crypto';

export const generateConfirmationToken = (length: number = 32): string => {
  const token = randomBytes(length).toString('hex');
  return token;
}

