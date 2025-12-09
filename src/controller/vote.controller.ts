import { Request, Response } from 'express';

import { IVote } from '../interface/vote.interface';
import { VoteService } from '../service/vote.service';
import { apiHandler, errorHandler } from '../util/apiHandler.util';

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  async getVoteByElectionIdVoterId(req: Request, res: Response): Promise<void> {
    try {
      const { election_id, voter_id } = req.params;
      const vote: IVote = await this.voteService.getVoteByElectionIdVoterId(BigInt(election_id), Number(voter_id));
      apiHandler(res, 200, 'Vote fetched successfuly', vote);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async hasVotedForElectionByVoterId(req: Request, res: Response): Promise<void> {
    try {
      const { election_id, voter_id } = req.params;
      const hasVoted = await this.voteService.hasVotedForElectionByVoterId(BigInt(election_id), Number(voter_id));
      apiHandler(res, 200, '', hasVoted);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
