import { ICandidateResponse } from './candidate.interface';
import { IElectionResponse, IElectionResponseForHost, IStage } from './election.interface';
import { IVoter } from './voter.interface';

export type IElectionCreatedEvent = 'onElectionCreated';

export type ICandidatesAddedForHostEvent = 'onCandidatesAddedForHost';
export type ICandidatesAddedForCandidatesEvent = 'onCandidatesAddedForCandidate';

export type IVotersAddedForHostEvent = 'onVotersAddedForHost';
export type IVotersAddedForVotersEvent = 'onVotersAddedForVoter';

export type IStageChangedEvent = 'onStageChanged';

export type IVotingStartedEvent = 'onVotingStarted';

export type IVotedForUsersEvent = 'onVotedForVoter';
export type IVotedForHostEvent = 'onVotedForHost';

export type IFinalize = 'onFinalize';

export interface IwsEvent {
  event: string;
  user_id: string;
}

export interface IonElectionCreated extends IwsEvent {
  readonly event: IElectionCreatedEvent;
  data: IElectionResponseForHost;
}

export interface IonCandidatesAddedForHost extends IwsEvent {
  readonly event: ICandidatesAddedForHostEvent;
  data: { id: bigint; candidates: Omit<ICandidateResponse, 'election_id'>[] };
}

export interface IonCandidatesAddedForCandidate extends IwsEvent {
  readonly event: ICandidatesAddedForCandidatesEvent;
  data: IElectionResponse;
}

export interface IonCandidatesAdded {
  hostEvent: IonCandidatesAddedForHost;
  candidatesEvent: IonCandidatesAddedForCandidate[];
}

export interface IonVotersAddedForHost extends IwsEvent {
  event: IVotersAddedForHostEvent;
  data: { id: bigint; voters: Omit<IVoter, 'election_id'>[] };
}

export interface IonVotersAddedForVoter extends IwsEvent {
  event: IVotersAddedForVotersEvent;
  data: IElectionResponse;
}

export interface IonVotersAdded {
  votersEvent: IonVotersAddedForVoter[];
  hostEvent: IonVotersAddedForHost;
}

export interface IonStageChanged extends IwsEvent {
  readonly event: IStageChangedEvent;
  data: { id: bigint; stage: IStage };
}

export interface IonVotingStarted extends IwsEvent {
  readonly event: IVotingStartedEvent;
  data: IElectionResponse;
}

export interface IonVotedForUser extends IwsEvent {
  readonly event: IVotedForUsersEvent;
  data: { id: bigint; candidate_id: number; votes: bigint };
}

export interface IonVotedForHost extends IwsEvent {
  readonly event: IVotedForHostEvent;
  data: { id: bigint; candidate_id: number; voter_id: number; votes: bigint };
}

export interface IonVoted {
  usersEvent: IonVotedForUser[];
  hostEvent: IonVotedForHost;
}

export interface IonFinalize extends IwsEvent {
  readonly event: IFinalize;
  data: { id: bigint; payout: bigint };
}
