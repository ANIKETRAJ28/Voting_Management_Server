import { Router } from 'express';

import { ElectionController } from '@/controller/election.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';

export const electionRouter = Router();
const electionController = new ElectionController();
const authMiddleware = new AuthMiddleware();

electionRouter.use(authMiddleware.verifyAccessToken.bind(authMiddleware));

electionRouter.get('/host', electionController.getElectionAsHost.bind(electionController));
electionRouter.get('/candidature', electionController.getElectionAsCandidature.bind(electionController));
electionRouter.get('/voter', electionController.getElectionAsVoter.bind(electionController));
