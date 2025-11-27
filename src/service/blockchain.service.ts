import { getInstance, IBlockchainClient } from '@/config/blockchain.config';
import { ICandidateChain, IVoterChain, IVotingManager } from '@/interface/blockchain.interface';
import { ICandidateRequest } from '@/interface/candidate.interface';
import { IElectionRequest } from '@/interface/election.interface';
import {
  ICandidatesAddedEvent,
  IElectionCreatedEvent,
  IFinalizedEvent,
  IStageChangedEvent,
  IVotedEvent,
  IVotersAddedEvent,
  IVotingStartedEvent,
} from '@/interface/handler.interface';
import { IVoterRequest } from '@/interface/voter.interface';
import { CandidateRepository } from '@/repository/candidate.repository';
import { ElectionRepository } from '@/repository/election.repository';
import { VoteRepository } from '@/repository/vote.repository';
import { VoterRepository } from '@/repository/voter.repository';

export class IBlockchainService implements IVotingManager {
  private instance: IBlockchainClient;
  private electionRepository: ElectionRepository;
  private candidateRepository: CandidateRepository;
  private voterRepository: VoterRepository;
  private voteRepository: VoteRepository;

  constructor() {
    this.instance = getInstance();
    this.electionRepository = new ElectionRepository();
    this.candidateRepository = new CandidateRepository();
    this.voterRepository = new VoterRepository();
    this.voteRepository = new VoteRepository();
  }

  async onElectionCreated(data: IElectionCreatedEvent): Promise<void> {
    const electionData: IElectionRequest = {
      id: data.id,
      title: data.title,
      host_address: data.host,
      stage: data.stage,
      deposit: data.deposit,
      created_at: data.created_at,
    };
    await this.electionRepository.createElection(electionData);
  }

  async onCandidatesAdded(data: ICandidatesAddedEvent): Promise<void> {
    const contract = this.instance.getContract();
    const candidates: ICandidateChain[] = await contract.getCandidates(data.id);
    const candidatesData: ICandidateRequest[] = candidates.map((candidate, idx) => ({
      id: idx as unknown as bigint,
      name: candidate.name,
      user_address: candidate.candidateAddress,
      votes: candidate.votes,
      election_id: data.id,
    }));
    await this.candidateRepository.createBulkCandidate(candidatesData);
  }

  async onVotersAdded(data: IVotersAddedEvent): Promise<void> {
    const contract = this.instance.getContract();
    const voters: IVoterChain[] = await contract.getVoters(data.id);
    const votersData: IVoterRequest[] = voters.map((voter) => ({ user_address: voter, election_id: data.id }));
    await this.voterRepository.createBulkVoter(votersData);
  }

  async onStageChanged(data: IStageChangedEvent): Promise<void> {
    const election = await this.electionRepository.updateElectionStage(data.id, data.host, data.newStage);
    // emit ws event
    console.log(election);
  }

  async onVotingStarted(data: IVotingStartedEvent): Promise<void> {
    const election = await this.electionRepository.updateElectionDeadline(data.id, data.host, data.deadline);
    // emit ws event
    console.log(election);
  }

  async onVoted(data: IVotedEvent): Promise<void> {
    const voter = await this.voterRepository.getVoterByAddress(data.voter);
    const vote = await this.voteRepository.createVote(data.id, data.candidateIndex, voter.id);
    console.log(vote);
    // emit ws event
  }

  async onFinalized(data: IFinalizedEvent): Promise<void> {
    const election = await this.electionRepository.updateElectionPayout(data.id, data.payout);
    // emit ws event
    console.log(election);
  }
}
