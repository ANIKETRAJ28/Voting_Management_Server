import { Router } from 'express';

import { VoteController } from '../../controller/vote.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';

export const voteRouter = Router();
const voteController = new VoteController();
const authMiddleware = new AuthMiddleware();

voteRouter.get(
  '/hasVote/:election_id/:voter_id',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  voteController.hasVotedForElectionByVoterId.bind(voteController),
);

voteRouter.get(
  '/:election_id/:voter_id',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  voteController.getVoteByElectionIdVoterId.bind(voteController),
);
