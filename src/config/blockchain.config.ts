import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

import { CONTRACT_ADDRESS, PRIVATE_KEY, RPC_URL, WS_URL } from './dotenv.config';

const abiPath = path.join(process.cwd(), 'json', 'votingManager_abi.config.json');

const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

class BlockchainClient {
  private provider: ethers.JsonRpcProvider;
  private wsProvider: ethers.WebSocketProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private static instance: BlockchainClient;

  private constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.wsProvider = new ethers.WebSocketProvider(WS_URL);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.wallet);
  }

  static getInstance(): BlockchainClient {
    if (!this.instance) {
      this.instance = new BlockchainClient();
    }
    return this.instance;
  }

  getContract(): ethers.Contract {
    return this.contract;
  }

  getWsProvider(): ethers.WebSocketProvider {
    return this.wsProvider;
  }
}

export const getInstance = () => BlockchainClient.getInstance();
export type IBlockchainClient = BlockchainClient;
