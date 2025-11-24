import Router from 'express';

import { authRoute } from '@/route/v1_route/auth.route';

export const v1_route = Router();

v1_route.use('/auth', authRoute);
