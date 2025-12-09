import Router from 'express';

import { authRoute } from './auth.route';
import { electionRouter } from './election.route';
import { voteRouter } from './vote.route';
import { voterRouter } from './voter.route';

export const v1_route = Router();

v1_route.use('/auth', authRoute);
v1_route.use('/election', electionRouter);
v1_route.use('/voter', voterRouter);
v1_route.use('/vote', voteRouter);
