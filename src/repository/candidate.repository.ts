import { PrismaClient } from '@prisma/client';

import { prisma } from '@/config/db.config';
import { ICandidate, ICandidateResponse } from '@/interface/candidate.interface';
import { IUser } from '@/interface/user.interface';
import { ApiError } from '@/util/api.util';

export class CandidateRepository {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async getCandidatureForUserId(id: string): Promise<ICandidateResponse[]> {
    const user: IUser | null = await this.client.user.findUnique({ where: { id: id } });
    if (user === null) throw new ApiError(401, 'User not found');
    const candidatureList: ICandidate[] = await this.client.candidate.findMany({
      where: { user_address: user.address },
    });
    return candidatureList.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
    }));
  }
}
