import { ICandidateResponse } from '@/interface/candidate.interface';

export type IStage = 'Created' | 'RegisterCandidates' | 'RegisterVoters' | 'Voting' | 'Finalized';

export interface IElectionRequest {
  title: string;
  host_address: string;
}

export interface IElectionChainResponse extends IElectionRequest {
  id: bigint;
  deposit: bigint;
  created_at: bigint;
}

export interface IElectionResponse extends IElectionRequest {
  id: bigint;
  stage: IStage;
  deadline: bigint | null;
  created_at: bigint;
}

export interface IElectionResponseWithCandidate extends IElectionResponse {
  candidates: ICandidateResponse[];
}

export interface IElectionResponseWithCandidateForHost extends IElectionResponseWithCandidate {
  deposit: bigint;
  finalize_payout: bigint | null;
}

export interface IElection extends IElectionResponse {
  deposit: bigint;
  finalize_payout: bigint | null;
  updated_at: Date;
}

export interface IElectionNotFound {
  error: true;
  id: bigint;
  message: string;
}
