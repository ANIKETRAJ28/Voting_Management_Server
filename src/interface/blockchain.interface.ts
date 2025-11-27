import {
  ICandidatesAddedEvent,
  IElectionCreatedEvent,
  IFinalizedEvent,
  IStageChangedEvent,
  IVotedEvent,
  IVotersAddedEvent,
  IVotingStartedEvent,
} from './handler.interface';

export interface IVotingManager {
  onElectionCreated(data: IElectionCreatedEvent): Promise<void> | void;
  onCandidatesAdded(data: ICandidatesAddedEvent): Promise<void> | void;
  onVotersAdded(data: IVotersAddedEvent): Promise<void> | void;
  onStageChanged(data: IStageChangedEvent): Promise<void> | void;
  onVotingStarted(data: IVotingStartedEvent): Promise<void> | void;
  onVoted(data: IVotedEvent): Promise<void> | void;
  onFinalized(data: IFinalizedEvent): Promise<void> | void;
}

export interface ICandidateChain {
  name: string;
  candidateAddress: string;
  votes: bigint;
}

export type IVoterChain = string;
