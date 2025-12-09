import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

import { PORT } from './config/dotenv.config';
import { IwsEvent } from './interface/ws.interface';
import { v1_route } from './route/v1_route/index.route';
import { BlockchainService } from './service/blockchain.service';
import { serializeBigInt } from './util/apiHandler.util';
import { initVotingManagerWS } from './util/blockchain.util';
import { corsOptions } from './util/cors.util';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', v1_route);

export const server = app.listen(PORT, () => {
  console.log(`Alive at http://localhost:${PORT}`);
  const blockchainService = new BlockchainService();
  initVotingManagerWS(blockchainService);
});

export const wss = new WebSocketServer({ server });
export const clients = new Map<string, WebSocket>();

wss.on('connection', (ws, req) => {
  ws.on('error', console.error);
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const userId = params.get('userId');
  if (userId) {
    clients.set(userId, ws);
  }
  ws.on('close', () => {
    console.log(`User ${userId} disconnected`);
    if (userId && clients.has(userId)) clients.delete(userId);
  });
});

export function emit(data: IwsEvent) {
  const ws: WebSocket | undefined = clients.get(data.user_id);
  if (ws) {
    console.log('client found');
    if (ws.readyState === WebSocket.OPEN) {
      const serializedData = serializeBigInt(data);
      ws.send(JSON.stringify(serializedData));
    }
  }
}
