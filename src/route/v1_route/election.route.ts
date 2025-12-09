import { Router } from 'express';

import { ElectionController } from '../../controller/election.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';

export const electionRouter = Router();
const electionController = new ElectionController();
const authMiddleware = new AuthMiddleware();

// electionRouter.use(authMiddleware.verifyAccessToken.bind(authMiddleware));

electionRouter.get(
  '/active',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  electionController.getActiveElectionsForUser.bind(electionController),
);

electionRouter.get(
  '/host',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  electionController.getElectionAsHost.bind(electionController),
);
electionRouter.get(
  '/candidature',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  electionController.getElectionAsCandidature.bind(electionController),
);
electionRouter.get(
  '/voter',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  electionController.getElectionAsVoter.bind(electionController),
);
electionRouter.get(
  '/:id',
  authMiddleware.verifyAccessToken.bind(authMiddleware),
  electionController.getElectionDetailById.bind(electionController),
);
