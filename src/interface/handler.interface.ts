import { IStage } from './election.interface';

export interface IElectionCreatedEvent {
  id: bigint;
  host: string;
  title: string;
  stage: IStage;
  deposit: bigint;
  created_at: bigint;
}

export interface ICandidatesAddedEvent {
  id: bigint;
}

export interface IFinalizedEvent {
  id: bigint;
  host: string;
  payout: bigint;
}

export interface IStageChangedEvent {
  id: bigint;
  host: string;
  newStage: IStage;
}

export interface IVotedEvent {
  id: bigint;
  voter: string;
  candidateAddress: string;
  candidateIndex: bigint;
}

export interface IVotersAddedEvent {
  id: bigint;
}

export interface IVotingStartedEvent {
  id: bigint;
  host: string;
  deadline: bigint;
}
