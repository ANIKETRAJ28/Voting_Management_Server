export interface IVoterRequest {
  user_address: string;
  election_id: bigint;
}

export interface IVoter extends IVoterRequest {
  id: number;
  has_voted: boolean;
}
