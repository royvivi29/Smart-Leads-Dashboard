import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

interface TokenPayload {
  id: string;
  role: UserRole;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};
