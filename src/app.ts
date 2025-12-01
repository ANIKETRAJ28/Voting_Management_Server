import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { corsOptions } from './util/cors.util';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

export default app;
