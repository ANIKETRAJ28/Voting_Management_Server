export interface IVoteRequest {
  election_id: bigint;
  voter_id: number;
  candidate_id: number;
}

export interface IVote extends IVoteRequest {
  id: number;
  timestamp: Date;
}
