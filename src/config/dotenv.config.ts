import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
