export interface ICandidateRequest {
  id: bigint;
  name: string;
  user_address: string;
  election_id: bigint;
  votes: bigint;
}

export type ICandidateResponse = ICandidateRequest;

export interface ICandidate extends ICandidateResponse {
  created_at: Date;
}
