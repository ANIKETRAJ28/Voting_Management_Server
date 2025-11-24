import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IUserResponse } from '@/interface/user.interface';
import { ApiError } from '@/util/api.util';
import { apiHandler, errorHandler } from '@/util/apiHandler.util';
import { refreshCookieOption } from '@/util/cookie.util';
import { generateAccessToken } from '@/util/token.util';

export class AuthMiddleware {
  verifyAccessToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const accessToken = req.headers['access_token'];
      if (accessToken === undefined || typeof accessToken !== 'string') {
        throw new ApiError(401, 'Access token not present');
      }
      const decodedToken = jwt.decode(accessToken);
      if (!decodedToken || typeof decodedToken === 'string' || decodedToken.exp === undefined)
        throw new ApiError(401, 'Token not found');
      if (decodedToken.exp * 1000 < Date.now()) {
        throw new ApiError(401, 'NO_ACCESS_EXPIRED');
      }
      const tokenData = decodedToken as IUserResponse;
      req.user_id = tokenData.id;
      req.user_address = tokenData.address;
      next();
    } catch (error) {
      errorHandler(error, res);
    }
  }

  refreshAccessToken(req: Request, res: Response): void {
    try {
      if (!req.cookies || !req.cookies['refresh_token']) {
        throw new ApiError(401, 'Unauthorized');
      }
      const jwtCookie = req.cookies['refresh_token'];
      const decodedToken = jwt.decode(jwtCookie);
      if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
        throw new ApiError(401, 'Unauthorized');
      }
      if (decodedToken.exp * 1000 < Date.now()) {
        res.clearCookie('refresh_token', refreshCookieOption);
        throw new ApiError(401, 'Unauthorized');
      }
      const tokenData = decodedToken as IUserResponse;
      const accessToken = generateAccessToken(tokenData);
      apiHandler(res, 201, 'New token created successfully', accessToken);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
