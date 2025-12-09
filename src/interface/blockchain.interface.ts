import { ICandidateRequest } from './candidate.interface';
import { IElectionRequest } from './election.interface';
import {
  IonCandidatesAdded,
  IonElectionCreated,
  IonFinalize,
  IonStageChanged,
  IonVoted,
  IonVotersAdded,
  IonVotingStarted,
} from './ws.interface';

export interface IVotingManager {
  onElectionCreated(data: IElectionRequest): Promise<IonElectionCreated>;
  onCandidatesAdded(election_id: bigint, data: ICandidateRequest[]): Promise<IonCandidatesAdded>;
  onVotersAdded(id: bigint, voters: string[]): Promise<IonVotersAdded>;
  onStageChanged(id: bigint, host_address: string, newStage: number): Promise<IonStageChanged[]>;
  onVotingStarted(id: bigint, host_address: string, deadline: bigint): Promise<IonVotingStarted[]>;
  onVoted(id: bigint, voter_address: string, candidature_address: string): Promise<IonVoted>;
  onFinalized(id: bigint, host_address: string, payout: bigint): Promise<IonFinalize>;
}

export interface ICandidateChain {
  name: string;
  candidateAddress: string;
  votes: bigint;
}

export type IVoterChain = string;
