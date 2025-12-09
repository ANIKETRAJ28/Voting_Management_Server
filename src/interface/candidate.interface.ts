export interface ICandidateRequest {
  name: string;
  user_address: string;
  election_id: bigint;
  votes: bigint;
}

export interface ICandidateResponse extends ICandidateRequest {
  id: number;
}

export interface ICandidate extends ICandidateResponse {
  created_at: Date;
}
