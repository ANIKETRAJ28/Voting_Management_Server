import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
export const WS_URL = process.env.WS_URL || 'ws://127.0.0.1:8545';
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
