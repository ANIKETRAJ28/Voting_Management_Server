import { ICandidateResponse } from './candidate.interface';
import { IVoter } from './voter.interface';

export type IStage = 'Created' | 'RegisterCandidates' | 'RegisterVoters' | 'Voting' | 'Finalized';

export const IStageMapper: IStage[] = ['Created', 'RegisterCandidates', 'RegisterVoters', 'Voting', 'Finalized'];

export interface IElectionRequest {
  id: bigint;
  host_address: string;
  title: string;
  stage: IStage;
  deposit: bigint;
  created_at: bigint;
}

export interface IElectionResponse extends Omit<IElectionRequest, 'deposit'> {
  deadline: bigint | null;
}

export interface IElection extends IElectionRequest {
  deadline: bigint | null;
  finalize_payout: bigint | null;
  updated_at: Date;
}

export interface IElectionResponseWithCandidate extends IElectionResponse {
  candidates: ICandidateResponse[];
}

export interface IElectionResponseForHost extends IElectionResponse {
  deposit: bigint;
  finalize_payout: bigint | null;
}

export interface IElectionResponseWithCandidateForHost extends IElectionResponseForHost {
  candidates: ICandidateResponse[];
  voters: IVoter[];
}

export interface IElectionNotFound {
  error: true;
  id: bigint;
  message: string;
}
