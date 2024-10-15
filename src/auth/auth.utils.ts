import { createHash } from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  return createHash('sha256').update(password).digest('hex');
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
};

export interface JwtPayload {
  sub: number;
  email: string;
}
