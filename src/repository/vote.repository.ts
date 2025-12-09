import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { ICandidateResponse } from '../interface/candidate.interface';
import { IVote } from '../interface/vote.interface';
import { IVoter } from '../interface/voter.interface';
import { ApiError } from '../util/api.util';
import { CandidateRepository } from './candidate.repository';
import { ElectionRepository } from './election.repository';
import { VoterRepository } from './voter.repository';

export class VoteRepository {
  private client: PrismaClient;
  private electionRepository: ElectionRepository;
  private candidateRepository: CandidateRepository;
  private voterRepository: VoterRepository;

  constructor() {
    this.client = prisma;
    this.electionRepository = new ElectionRepository();
    this.candidateRepository = new CandidateRepository();
    this.voterRepository = new VoterRepository();
  }

  async createVote(id: bigint, candidate_adress: string, voter_address: string): Promise<IVote> {
    await this.electionRepository.getElectionById(id);
    const candidate: ICandidateResponse = await this.candidateRepository.getCandidatureByElectionIdAndUserAddress(
      id,
      candidate_adress,
    );
    const voter: IVoter = await this.voterRepository.getVoterByElectionIdAndUserAddress(id, voter_address);
    if (voter.has_voted) throw new ApiError(409, 'Already voted');
    const vote: IVote = await this.client.vote.create({
      data: { election_id: id, candidate_id: candidate.id, voter_id: voter.id },
    });
    await this.candidateRepository.updatevotesByCandidateId(candidate.id);
    await this.voterRepository.updateVoterHasVoted(voter.id);
    return vote;
  }

  async getVoteByElectionIdVoterId(election_id: bigint, voter_id: number): Promise<IVote> {
    const vote: IVote | null = await this.client.vote.findUnique({
      where: { voter_id_election_id: { election_id: election_id, voter_id: voter_id } },
    });
    if (vote === null) throw new ApiError(409, 'Vote not found');
    return vote;
  }

  async hasVotedForElectionByVoterId(election_id: bigint, voter_id: number): Promise<boolean> {
    const vote: IVote | null = await this.client.vote.findUnique({
      where: { voter_id_election_id: { election_id: election_id, voter_id: voter_id } },
    });
    return vote !== null;
  }
}
