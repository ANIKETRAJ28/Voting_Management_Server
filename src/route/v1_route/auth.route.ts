import Router from 'express';

import { AuthController } from '@/controller/auth.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';

export const authRoute = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

authRoute.post('/authenticate', authController.authenticate.bind(authController));
authRoute.post('/verify', authController.verify.bind(authController));
authRoute.post('/refresh', authMiddleware.refreshAccessToken.bind(authMiddleware));
authRoute.post(
  '/logout',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  authController.logout.bind(authController),
);
