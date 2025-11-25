import { PrismaClient } from '@prisma/client';

import { prisma } from '@/config/db.config';
import { IUser } from '@/interface/user.interface';
import { IVoter, IVoterRequest } from '@/interface/voter.interface';
import { ApiError } from '@/util/api.util';

export class VoterRepository {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async getVoterForUserId(id: string): Promise<IVoter[]> {
    const user: IUser | null = await this.client.user.findUnique({ where: { id: id } });
    if (user === null) throw new ApiError(401, 'User not found');
    const voterList: IVoter[] = await this.client.voter.findMany({ where: { user_address: user.address } });
    return voterList;
  }

  async createVoter(data: IVoterRequest): Promise<IVoter> {
    const voter: IVoter = await this.client.voter.create({ data: data });
    return voter;
  }

  async createBulkVoter(data: IVoterRequest[]): Promise<IVoter[]> {
    const voters: IVoter[] = await this.client.voter.createManyAndReturn({ data: data });
    return voters;
  }
}
