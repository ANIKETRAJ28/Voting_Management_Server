import { ethers } from 'ethers';

import { emit } from '..';
import { getInstance, IBlockchainClient } from '../config/blockchain.config';
import { ICandidateChain, IVotingManager } from '../interface/blockchain.interface';
import { ICandidateRequest } from '../interface/candidate.interface';
import { IElectionRequest, IStageMapper } from '../interface/election.interface';
import {
  IonCandidatesAdded,
  IonElectionCreated,
  IonFinalize,
  IonStageChanged,
  IonVoted,
  IonVotersAdded,
  IonVotingStarted,
  IwsEvent,
} from '../interface/ws.interface';

export function initVotingManagerWS(handlers: IVotingManager) {
  const instance: IBlockchainClient = getInstance();
  const ws: ethers.WebSocketProvider = instance.getWsProvider();
  const contract: ethers.Contract = instance.getContract();
  const wsContract: ethers.BaseContract = contract.connect(ws);

  console.log('🔌 WebSocket connected to VotingManager contract');

  wsContract.on(
    'ElectionCreated',
    async (id: bigint, host: string, title: string, stage: number, deposit: bigint, createdAt: bigint) => {
      const reqObj: IElectionRequest = {
        id,
        title,
        host_address: host,
        stage: IStageMapper[stage],
        deposit,
        created_at: createdAt,
      };
      const wsEvent: IonElectionCreated = await handlers.onElectionCreated(reqObj);
      emit(wsEvent);
    },
  );

  wsContract.on('CandidatesAdded', async (id: bigint) => {
    const candidates: ICandidateChain[] = await contract.getCandidates(id);
    const candidatesData: ICandidateRequest[] = candidates.map((candidate) => ({
      name: candidate.name,
      user_address: candidate.candidateAddress,
      votes: candidate.votes,
      election_id: id,
    }));
    const wsEvent: IonCandidatesAdded = await handlers.onCandidatesAdded(id, candidatesData);
    emit(wsEvent.hostEvent);
    wsEvent.candidatesEvent.forEach((event: IwsEvent) => emit(event));
  });

  wsContract.on('VotersAdded', async (id: bigint) => {
    const voters: string[] = await contract.getVoters(id);
    const wsEvent: IonVotersAdded = await handlers.onVotersAdded(id, voters);
    emit(wsEvent.hostEvent);
    wsEvent.votersEvent.forEach((event: IwsEvent) => emit(event));
  });

  wsContract.on('StageChanged', async (id: bigint, host: string, newStage: number) => {
    const wsEvent: IonStageChanged[] = await handlers.onStageChanged(id, host, newStage);
    wsEvent.forEach((event: IwsEvent) => emit(event));
  });

  wsContract.on('VotingStarted', async (id: bigint, host: string, deadline: bigint) => {
    const wsEvent: IonVotingStarted[] = await handlers.onVotingStarted(id, host, deadline);
    wsEvent.forEach((event: IwsEvent) => emit(event));
  });

  wsContract.on('Voted', async (id: bigint, voterAddress: string, candidateAddress: string) => {
    const wsEvent: IonVoted = await handlers.onVoted(id, voterAddress, candidateAddress);
    emit(wsEvent.hostEvent);
    wsEvent.usersEvent.forEach((event: IwsEvent) => emit(event));
  });

  wsContract.on('Finalized', async (id: bigint, host: string, payout: bigint) => {
    const wsEvent: IonFinalize = await handlers.onFinalized(id, host, payout);
    emit(wsEvent);
  });
}
