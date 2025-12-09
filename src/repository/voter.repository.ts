import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { IUser } from '../interface/user.interface';
import { IVoter, IVoterRequest } from '../interface/voter.interface';
import { ApiError } from '../util/api.util';

export class VoterRepository {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async getVotersForElection(election_id: bigint): Promise<IVoter[]> {
    const voters: IVoter[] = await this.client.voter.findMany({ where: { election_id: election_id } });
    return voters;
  }

  async getVoterById(id: number): Promise<IVoter> {
    const voter: IVoter | null = await this.client.voter.findUnique({ where: { id: id } });
    if (voter === null) throw new ApiError(404, 'Voter not found');
    return voter;
  }

  async getVoterByElectionIdAndUserAddress(election_id: bigint, user_address: string): Promise<IVoter> {
    const voter: IVoter | null = await this.client.voter.findUnique({
      where: { user_address_election_id: { election_id: election_id, user_address: user_address } },
    });
    if (voter === null) throw new ApiError(404, 'Voter not found');
    return voter;
  }

  async getVoterByAddress(address: string): Promise<IVoter> {
    const voter: IVoter | null = await this.client.voter.findFirst({ where: { user_address: address } });
    if (voter === null) throw new ApiError(404, 'Voter not found');
    return voter;
  }

  async getVoterForUserId(id: string): Promise<IVoter[]> {
    const user: IUser | null = await this.client.user.findUnique({ where: { id: id } });
    if (user === null) throw new ApiError(404, 'User not found');
    const voterList: IVoter[] = await this.client.voter.findMany({
      where: { user_address: user.address },
      orderBy: { id: 'desc' },
    });
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

  async updateVoterHasVoted(id: number): Promise<IVoter> {
    let voter: IVoter = await this.getVoterById(id);
    if (voter.has_voted) throw new ApiError(409, 'Already voted');
    voter = await this.client.voter.update({ where: { id: id }, data: { has_voted: true } });
    return voter;
  }
}
