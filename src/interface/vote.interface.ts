export interface IVote {
  id: number;
  election_id: bigint;
  voter_id: number;
  candidate_id: bigint;
  timestamp: Date;
}

export interface IVoteRequest {
  election_id: bigint;
  voter_id: number;
  candidate_id: bigint;
}
