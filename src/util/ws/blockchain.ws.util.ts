import { ethers } from 'ethers';

import { getInstance, IBlockchainClient } from '@/config/blockchain.config';
import { IVotingManager } from '@/interface/blockchain.interface';
import {
  ICandidatesAddedEvent,
  IElectionCreatedEvent,
  IFinalizedEvent,
  IStageChangedEvent,
  IVotedEvent,
  IVotersAddedEvent,
  IVotingStartedEvent,
} from '@/interface/handler.interface';

export function initVotingManagerWS(handlers: IVotingManager) {
  const instance: IBlockchainClient = getInstance();
  const ws: ethers.WebSocketProvider = instance.getWsProvider();
  const contract: ethers.BaseContract = instance.getContract();
  const wsContract: ethers.BaseContract = contract.connect(ws);

  console.log('🔌 WebSocket connected to VotingManager contract');

  wsContract.on('ElectionCreated', (data: IElectionCreatedEvent) => {
    handlers.onElectionCreated(data);
  });
  wsContract.on('CandidatesAdded', (data: ICandidatesAddedEvent) => handlers.onCandidatesAdded(data));
  wsContract.on('VotersAdded', (data: IVotersAddedEvent) => handlers.onVotersAdded(data));
  wsContract.on('StageChanged', (data: IStageChangedEvent) => handlers.onStageChanged(data));
  wsContract.on('VotingStarted', (data: IVotingStartedEvent) => handlers.onVotingStarted(data));
  wsContract.on('Voted', (data: IVotedEvent) => handlers.onVoted(data));
  wsContract.on('Finalized', (data: IFinalizedEvent) => handlers.onFinalized(data));
}
