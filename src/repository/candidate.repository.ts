import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { ICandidate, ICandidateRequest, ICandidateResponse } from '../interface/candidate.interface';
import { IUser } from '../interface/user.interface';
import { ApiError } from '../util/api.util';

export class CandidateRepository {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async getCandidatesForElection(election_id: bigint): Promise<ICandidateResponse[]> {
    const candidates: ICandidate[] = await this.client.candidate.findMany({ where: { election_id: election_id } });
    return candidates.map((candidate: ICandidate) => ({
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    }));
  }

  async getCandidatureByElectionIdAndUserAddress(
    election_id: bigint,
    user_address: string,
  ): Promise<ICandidateResponse> {
    const candidate: ICandidate | null = await this.client.candidate.findUnique({
      where: { user_address_election_id: { election_id: election_id, user_address: user_address } },
    });
    if (candidate === null) throw new ApiError(404, 'Candidate not found');
    return {
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    };
  }

  async getCandidateById(id: number): Promise<ICandidateResponse> {
    const candidate: ICandidate | null = await this.client.candidate.findUnique({ where: { id: id } });
    if (candidate === null) throw new ApiError(404, 'Candidate not found');
    return {
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    };
  }

  async getCandidatureForUserId(id: string): Promise<ICandidateResponse[]> {
    const user: IUser | null = await this.client.user.findUnique({ where: { id: id } });
    if (user === null) throw new ApiError(404, 'User not found');
    const candidatureList: ICandidate[] = await this.client.candidate.findMany({
      where: { user_address: user.address },
      orderBy: { id: 'desc' },
    });
    return candidatureList.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    }));
  }

  async createCandidate(data: ICandidateRequest): Promise<ICandidateResponse> {
    const candidate: ICandidate = await this.client.candidate.create({
      data: { name: data.name, user_address: data.user_address, election_id: data.election_id },
    });
    return {
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    };
  }

  async createBulkCandidate(data: ICandidateRequest[]): Promise<ICandidateResponse[]> {
    const candidates: ICandidate[] = await this.client.candidate.createManyAndReturn({ data: data });
    return candidates.map((candidate: ICandidate) => ({
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    }));
  }

  async updatevotesByCandidateId(id: number): Promise<ICandidateResponse> {
    let candidate = await this.getCandidateById(id);
    candidate = await this.client.candidate.update({ where: { id: id }, data: { votes: candidate.votes + BigInt(1) } });
    return {
      id: candidate.id,
      name: candidate.name,
      user_address: candidate.user_address,
      election_id: candidate.election_id,
      votes: candidate.votes,
    };
  }
}
