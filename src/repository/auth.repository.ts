import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { IUser, IUserResponse } from '../interface/user.interface';
import { ApiError } from '../util/api.util';
import { randomNonce } from '../util/randomKeys.util';

export class AuthRepository {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async getUserByAddress(address: string): Promise<IUserResponse> {
    const user: IUser | null = await this.client.user.findUnique({ where: { address: address } });
    if (user === null) throw new ApiError(404, 'User not found with given address');
    return user;
  }

  async authenticate(address: string): Promise<string> {
    const nonce = `Login request: ${randomNonce}`;
    await this.client.user.upsert({
      where: { address: address },
      create: { address: address, nonce: nonce },
      update: { nonce: nonce },
    });
    return nonce;
  }

  async verify(address: string, nonce: string): Promise<IUserResponse> {
    const user: IUser | null = await this.client.user.findUnique({ where: { address: address } });
    if (user === null) throw new ApiError(400, 'Address or signature is invalid');
    if (user.nonce !== nonce) throw new ApiError(400, 'Address or signature is invalid');
    await this.client.user.update({ where: { id: user.id }, data: { nonce: randomNonce, last_login: new Date() } });
    return { id: user.id, address: user.address };
  }

  async verifyUserByAddress(address: string): Promise<boolean> {
    return (await this.client.user.findUnique({ where: { address: address } })) !== null;
  }
}
