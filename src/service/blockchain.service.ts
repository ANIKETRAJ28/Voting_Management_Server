import { IVotingManager } from '../interface/blockchain.interface';
import { ICandidateRequest, ICandidateResponse } from '../interface/candidate.interface';
import {
  IElectionRequest,
  IElectionResponse,
  IElectionResponseForHost,
  IStageMapper,
} from '../interface/election.interface';
import { IUserResponse } from '../interface/user.interface';
import { IVoter, IVoterRequest } from '../interface/voter.interface';
import {
  IonCandidatesAdded,
  IonCandidatesAddedForCandidate,
  IonCandidatesAddedForHost,
  IonElectionCreated,
  IonFinalize,
  IonStageChanged,
  IonVoted,
  IonVotedForHost,
  IonVotedForUser,
  IonVotersAdded,
  IonVotersAddedForHost,
  IonVotersAddedForVoter,
  IonVotingStarted,
} from '../interface/ws.interface';
import { AuthRepository } from '../repository/auth.repository';
import { CandidateRepository } from '../repository/candidate.repository';
import { ElectionRepository } from '../repository/election.repository';
import { VoteRepository } from '../repository/vote.repository';
import { VoterRepository } from '../repository/voter.repository';

export class BlockchainService implements IVotingManager {
  private electionRepository: ElectionRepository;
  private candidateRepository: CandidateRepository;
  private voterRepository: VoterRepository;
  private voteRepository: VoteRepository;
  private authRepository: AuthRepository;

  constructor() {
    this.electionRepository = new ElectionRepository();
    this.candidateRepository = new CandidateRepository();
    this.voterRepository = new VoterRepository();
    this.voteRepository = new VoteRepository();
    this.authRepository = new AuthRepository();
  }

  async onElectionCreated(data: IElectionRequest): Promise<IonElectionCreated> {
    const election: IElectionResponseForHost = await this.electionRepository.createElection(data);
    const user: IUserResponse = await this.authRepository.getUserByAddress(election.host_address);
    const wsEvent: IonElectionCreated = {
      event: 'onElectionCreated',
      user_id: user.id,
      data: election,
    };
    return wsEvent;
  }

  async onCandidatesAdded(id: bigint, data: ICandidateRequest[]): Promise<IonCandidatesAdded> {
    const candidates: ICandidateResponse[] = await this.candidateRepository.createBulkCandidate(data);
    const election: IElectionResponse = await this.electionRepository.getElectionById(id);
    const host: IUserResponse = await this.authRepository.getUserByAddress(election.host_address);
    const hostEvent: IonCandidatesAddedForHost = {
      event: 'onCandidatesAddedForHost',
      user_id: host.id,
      data: {
        candidates: candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          user_address: candidate.user_address,
          votes: candidate.votes,
        })),
        id: election.id,
      },
    };
    const candidatesEvent: IonCandidatesAddedForCandidate[] = await Promise.all(
      candidates.map(async (candidate): Promise<IonCandidatesAddedForCandidate> => {
        const user: IUserResponse = await this.authRepository.getUserByAddress(candidate.user_address);
        return {
          event: 'onCandidatesAddedForCandidate',
          user_id: user.id,
          data: election,
        };
      }),
    );
    return { candidatesEvent, hostEvent };
  }

  async onVotersAdded(id: bigint, voters: string[]): Promise<IonVotersAdded> {
    const votersData: IVoterRequest[] = voters.map((voter) => ({ user_address: voter, election_id: id }));
    const election: IElectionResponse = await this.electionRepository.getElectionById(id);
    const votersResponse: IVoter[] = await this.voterRepository.createBulkVoter(votersData);
    const host: IUserResponse = await this.authRepository.getUserByAddress(election.host_address);
    const votersDetails: IUserResponse[] = await Promise.all(
      votersResponse.map(
        async (voter): Promise<IUserResponse> => await this.authRepository.getUserByAddress(voter.user_address),
      ),
    );
    const hostEvent: IonVotersAddedForHost = {
      event: 'onVotersAddedForHost',
      user_id: host.id,
      data: {
        id: election.id,
        voters: votersResponse.map(
          (voter): Omit<IVoter, 'election_id'> => ({
            id: voter.id,
            user_address: voter.user_address,
            has_voted: voter.has_voted,
          }),
        ),
      },
    };
    const votersEvent: IonVotersAddedForVoter[] = votersDetails.map((voter) => ({
      event: 'onVotersAddedForVoter',
      user_id: voter.id,
      data: election,
    }));
    const wsEvent: IonVotersAdded = { hostEvent, votersEvent };
    return wsEvent;
  }

  async onStageChanged(id: bigint, host_address: string, newStage: number): Promise<IonStageChanged[]> {
    const stage = IStageMapper[newStage];
    const election: IElectionResponse = await this.electionRepository.updateElectionStage(id, host_address, stage);
    const voters: IVoter[] = await this.voterRepository.getVotersForElection(id);
    const candidates: ICandidateResponse[] = await this.candidateRepository.getCandidatesForElection(id);
    const wsEvent: IonStageChanged[] = [];
    wsEvent.push(
      ...(await Promise.all(
        voters.map(async (voter: IVoter): Promise<IonStageChanged> => {
          const user: IUserResponse = await this.authRepository.getUserByAddress(voter.user_address);
          return {
            event: 'onStageChanged',
            user_id: user.id,
            data: { id: election.id, stage: election.stage },
          };
        }),
      )),
    );
    wsEvent.push(
      ...(await Promise.all(
        candidates.map(async (candidate: ICandidateResponse): Promise<IonStageChanged> => {
          const user: IUserResponse = await this.authRepository.getUserByAddress(candidate.user_address);
          return {
            event: 'onStageChanged',
            user_id: user.id,
            data: { id: election.id, stage: election.stage },
          };
        }),
      )),
    );
    return wsEvent;
  }

  async onVotingStarted(id: bigint, host_address: string, deadline: bigint): Promise<IonVotingStarted[]> {
    const election: IElectionResponse = await this.electionRepository.updateElectionDeadline(
      id,
      host_address,
      deadline,
    );
    const candidates: ICandidateResponse[] = await this.candidateRepository.getCandidatesForElection(election.id);
    const voters: IVoter[] = await this.voterRepository.getVotersForElection(election.id);
    const wsEvent: IonVotingStarted[] = [];
    wsEvent.push(
      ...(await Promise.all(
        candidates.map(async (candidate: ICandidateResponse): Promise<IonVotingStarted> => {
          const user = await this.authRepository.getUserByAddress(candidate.user_address);
          return {
            event: 'onVotingStarted',
            user_id: user.id,
            data: election,
          };
        }),
      )),
    );
    wsEvent.push(
      ...(await Promise.all(
        voters.map(async (voter: IVoter): Promise<IonVotingStarted> => {
          const user = await this.authRepository.getUserByAddress(voter.user_address);
          return {
            event: 'onVotingStarted',
            user_id: user.id,
            data: election,
          };
        }),
      )),
    );
    return wsEvent;
  }

  async onVoted(id: bigint, voter_address: string, candidature_address: string): Promise<IonVoted> {
    const vote = await this.voteRepository.createVote(id, candidature_address, voter_address);
    const election: IElectionResponse = await this.electionRepository.getElectionById(id);
    const candidate: ICandidateResponse = await this.candidateRepository.getCandidatureByElectionIdAndUserAddress(
      id,
      candidature_address,
    );
    const voters: IVoter[] = await this.voterRepository.getVotersForElection(id);
    const candidates: ICandidateResponse[] = await this.candidateRepository.getCandidatesForElection(id);
    const host: IUserResponse = await this.authRepository.getUserByAddress(election.host_address);
    const usersEvent: IonVotedForUser[] = [];
    usersEvent.push(
      ...(await Promise.all(
        voters.map(async (voter: IVoter): Promise<IonVotedForUser> => {
          const user: IUserResponse = await this.authRepository.getUserByAddress(voter.user_address);
          return {
            event: 'onVotedForVoter',
            user_id: user.id,
            data: { id: election.id, candidate_id: vote.candidate_id, votes: candidate.votes },
          };
        }),
      )),
    );
    usersEvent.push(
      ...(await Promise.all(
        candidates.map(async (candidate: ICandidateResponse): Promise<IonVotedForUser> => {
          const user: IUserResponse = await this.authRepository.getUserByAddress(candidate.user_address);
          return {
            event: 'onVotedForVoter',
            user_id: user.id,
            data: { id: election.id, candidate_id: vote.candidate_id, votes: candidate.votes },
          };
        }),
      )),
    );
    const hostEvent: IonVotedForHost = {
      event: 'onVotedForHost',
      user_id: host.id,
      data: { id: election.id, candidate_id: vote.candidate_id, voter_id: vote.voter_id, votes: candidate.votes },
    };
    return {
      hostEvent,
      usersEvent,
    };
  }

  async onFinalized(id: bigint, host_address: string, payout: bigint): Promise<IonFinalize> {
    const election: IElectionResponseForHost = await this.electionRepository.updateElectionPayout(
      id,
      host_address,
      payout,
    );
    const user: IUserResponse = await this.authRepository.getUserByAddress(host_address);
    const wsEvent: IonFinalize = {
      event: 'onFinalize',
      user_id: user.id,
      data: { id: election.id, payout: election.finalize_payout as bigint },
    };
    return wsEvent;
  }
}
