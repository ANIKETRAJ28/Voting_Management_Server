export interface ICandidateRequest {
  name: string;
  user_address: string;
  election_id: bigint;
}

export interface ICandidateResponse extends ICandidateRequest {
  id: number;
}

export interface ICandidateResponseWithVotes extends ICandidateResponse {
  votes: bigint;
}

export interface ICandidate extends ICandidateResponse {
  created_at: Date;
}
