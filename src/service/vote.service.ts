import { IVote } from '../interface/vote.interface';
import { VoteRepository } from '../repository/vote.repository';

export class VoteService {
  private voteRepository: VoteRepository;

  constructor() {
    this.voteRepository = new VoteRepository();
  }

  async getVoteByElectionIdVoterId(election_id: bigint, voter_id: number): Promise<IVote> {
    return await this.voteRepository.getVoteByElectionIdVoterId(election_id, voter_id);
  }

  async hasVotedForElectionByVoterId(election_id: bigint, voter_id: number): Promise<boolean> {
    return await this.voteRepository.hasVotedForElectionByVoterId(election_id, voter_id);
  }
}
