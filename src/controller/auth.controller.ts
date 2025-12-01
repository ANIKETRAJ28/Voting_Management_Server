import { Request, Response } from 'express';

import { IUserResponse } from '../interface/user.interface';
import { AuthService } from '../service/auth.service';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { refreshCookieOption } from '../util/cookie.util';
import { generateAccessToken, generateRefreshToken } from '../util/token.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { address }: { address: string } = req.body();
      const nonce: string = await this.authService.authenticate(address);
      apiHandler(res, 201, 'Please sign message to complete authentication', nonce);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { address, signature, nonce }: { address: string; signature: string; nonce: string } = req.body();
      const userData: IUserResponse = await this.authService.verify(address, signature, nonce);
      const accessToken = generateAccessToken({ address: userData.address, id: userData.id });
      const refreshToken = generateRefreshToken({ address: userData.address, id: userData.id });
      res.cookie('refresh_token', refreshToken, refreshCookieOption);
      apiHandler(res, 201, 'Verified successfully', accessToken);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async verifyUserByAddress(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const response = await this.authService.verifyUserByAddress(address);
      if (response) apiHandler(res, 200, 'User exist', response);
      else apiHandler(res, 200, 'User does not exist', response);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refresh_token', refreshCookieOption);
    apiHandler(res, 201, 'Loged out successfully');
  }
}
