import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { IVote } from '../interface/vote.interface';
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

  async createVote(election_id: bigint, candidate_id: bigint, voter_id: number): Promise<IVote> {
    await this.electionRepository.getElectionById(election_id);
    await this.candidateRepository.getCandidateById(candidate_id);
    await this.voterRepository.getVoterById(voter_id);
    const vote: IVote = await this.client.vote.create({
      data: { election_id: election_id, candidate_id: candidate_id, voter_id: voter_id },
    });
    return vote;
  }
}
