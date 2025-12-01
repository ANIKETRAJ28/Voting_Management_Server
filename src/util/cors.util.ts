import { FRONTEND_URL } from '../config/dotenv.config';

export const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};
