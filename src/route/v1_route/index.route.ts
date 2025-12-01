import Router from 'express';

import { authRoute } from '../../route/v1_route/auth.route';
import { electionRouter } from '../../route/v1_route/election.route';

export const v1_route = Router();

v1_route.use('/auth', authRoute);
v1_route.use('/election', electionRouter);
