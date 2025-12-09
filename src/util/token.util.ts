import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config/dotenv.config';

export function generateAccessToken(data: { id: string; address: string }): string {
  const accessToken = jwt.sign(data, JWT_SECRET_KEY as string, {
    expiresIn: '15min',
  });
  return accessToken;
}

export function generateRefreshToken(data: { id: string; address: string }): string {
  const refreshToken = jwt.sign(data, JWT_SECRET_KEY as string, {
    expiresIn: '7d',
  });
  return refreshToken;
}
