import { Router } from 'express';

import { VoterController } from '../../controller/voter.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';

export const voterRouter = Router();
const voterController = new VoterController();
const authMiddleware = new AuthMiddleware();

voterRouter.get(
  '/election/:id',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  voterController.getVoterByElectionIdAndUserAddress.bind(voterController),
);
