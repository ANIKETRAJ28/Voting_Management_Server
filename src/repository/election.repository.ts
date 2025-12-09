import { PrismaClient } from '@prisma/client';

import { prisma } from '../config/db.config';
import { ICandidateResponse } from '../interface/candidate.interface';
import {
  IElection,
  IElectionNotFound,
  IElectionRequest,
  IElectionResponse,
  IElectionResponseForHost,
  IElectionResponseWithCandidate,
  IElectionResponseWithCandidateForHost,
  IStage,
} from '../interface/election.interface';
import { IUser } from '../interface/user.interface';
import { IVoter } from '../interface/voter.interface';
import { CandidateRepository } from '../repository/candidate.repository';
import { VoterRepository } from '../repository/voter.repository';
import { ApiError } from '../util/api.util';

export class ElectionRepository {
  private client: PrismaClient;
  private candidateRepository: CandidateRepository;
  private voterRepository: VoterRepository;

  constructor() {
    this.client = prisma;
    this.candidateRepository = new CandidateRepository();
    this.voterRepository = new VoterRepository();
  }

  async getElectionById(id: bigint): Promise<IElectionResponse> {
    const election: IElection | null = await this.client.election.findUnique({ where: { id: id } });
    if (election === null) throw new ApiError(404, 'Election not found');
    return {
      id: election.id,
      title: election.title,
      host_address: election.host_address,
      stage: election.stage,
      deadline: election.deadline,
      created_at: election.created_at,
    };
  }

  async getElectionsAsCandidature(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    const candidatureElections: ICandidateResponse[] = await this.candidateRepository.getCandidatureForUserId(id);
    const elections: (IElectionResponse | IElectionNotFound)[] = await Promise.all(
      candidatureElections.map(
        async (candidateElection: ICandidateResponse): Promise<IElectionResponse | IElectionNotFound> => {
          const election: IElection | null = await this.client.election.findUnique({
            where: { id: candidateElection.election_id },
          });
          if (election === null) {
            return {
              error: true,
              id: candidateElection.election_id,
              message: `Election with ID ${candidateElection.election_id} not found`,
            };
          }
          return {
            id: election.id,
            title: election.title,
            host_address: election.host_address,
            stage: election.stage,
            deadline: election.deadline,
            created_at: election.created_at,
          };
        },
      ),
    );
    return elections;
  }

  async getElectionsAsVoter(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    const voterElections: IVoter[] = await this.voterRepository.getVoterForUserId(id);
    const elections: (IElectionResponse | IElectionNotFound)[] = await Promise.all(
      voterElections.map(async (voterElection: IVoter): Promise<IElectionResponse | IElectionNotFound> => {
        const election: IElection | null = await this.client.election.findUnique({
          where: { id: voterElection.election_id },
        });
        if (election === null) {
          return {
            error: true,
            id: voterElection.election_id,
            message: `Election with ID ${voterElection.election_id} not found`,
          };
        }
        return {
          id: election.id,
          title: election.title,
          host_address: election.host_address,
          stage: election.stage,
          deadline: election.deadline,
          created_at: election.created_at,
        };
      }),
    );
    return elections;
  }

  async getElectionsAsHost(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    const user: IUser | null = await this.client.user.findUnique({ where: { id: id } });
    if (user === null) throw new ApiError(404, 'User not found');
    const hostedElections: IElection[] = await this.client.election.findMany({
      where: { host_address: user.address },
      orderBy: { id: 'desc' },
    });
    const elections: IElectionResponse[] = hostedElections.map(
      (hostedElection: IElection): IElectionResponse => ({
        id: hostedElection.id,
        title: hostedElection.title,
        host_address: hostedElection.host_address,
        stage: hostedElection.stage,
        deadline: hostedElection.deadline,
        created_at: hostedElection.created_at,
      }),
    );
    return elections;
  }

  async getActiveElectionsForUser(user_id: string): Promise<IElectionResponse[]> {
    const hostedElections = await this.getElectionsAsHost(user_id);
    const candidatureElections = await this.getElectionsAsCandidature(user_id);
    const voterElections = await this.getElectionsAsVoter(user_id);
    function filterActiveElections(elections: (IElectionResponse | IElectionNotFound)[]): IElectionResponse[] {
      return elections.filter(
        (election): election is IElectionResponse => 'stage' in election && election.stage === 'Created',
      );
    }
    const activeElections = [
      ...filterActiveElections(hostedElections),
      ...filterActiveElections(candidatureElections),
      ...filterActiveElections(voterElections),
    ];
    activeElections.sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
    return activeElections;
  }

  async getElectionDetailById(
    id: bigint,
    user_address: string,
  ): Promise<IElectionResponseWithCandidate | IElectionResponseWithCandidateForHost> {
    if (
      (await this.client.election.findUnique({
        where: {
          id: id,
          OR: [
            { host_address: user_address },
            { voters: { some: { user_address: user_address } } },
            { candidates: { some: { user_address: user_address } } },
          ],
        },
      })) === null
    )
      throw new ApiError(404, 'Election not found');
    const election: (IElectionResponseWithCandidateForHost & { updated_at: Date }) | null =
      await this.client.election.findUnique({ where: { id: id }, include: { candidates: true, voters: true } });
    if (election === null) throw new ApiError(404, 'Election not found');
    const detailedElection: IElectionResponseWithCandidateForHost = {
      id: election.id,
      title: election.title,
      host_address: election.host_address,
      stage: election.stage,
      deadline: election.deadline,
      created_at: election.created_at,
      candidates: election.candidates,
      voters: election.voters,
      deposit: election.deposit,
      finalize_payout: election.finalize_payout,
    };
    if (user_address === detailedElection.host_address) return detailedElection;
    return {
      id: election.id,
      title: election.title,
      host_address: election.host_address,
      stage: election.stage,
      deadline: election.deadline,
      created_at: election.created_at,
      candidates: election.candidates,
    };
  }

  async createElection(data: IElectionRequest): Promise<IElectionResponseForHost> {
    const election = await this.client.election.create({ data: data });
    return {
      id: election.id,
      title: election.title,
      stage: election.stage,
      host_address: election.host_address,
      created_at: election.created_at,
      deadline: election.deadline,
      deposit: election.deposit,
      finalize_payout: election.finalize_payout,
    };
  }

  async updateElectionStage(election_id: bigint, user_address: string, stage: IStage): Promise<IElectionResponse> {
    let election: IElection | null = await this.client.election.findUnique({ where: { id: election_id } });
    if (election === null) throw new ApiError(404, 'Election not found');
    if (election.host_address !== user_address) throw new ApiError(403, 'Unauthorized for this action');
    switch (stage) {
      case 'Created': {
        throw new ApiError(403, 'Cannot perform this action');
      }
      case 'RegisterCandidates': {
        if (election.stage !== 'Created') throw new ApiError(403, 'Cannot perform this action');
        break;
      }
      case 'RegisterVoters': {
        if (election.stage !== 'RegisterCandidates') throw new ApiError(403, 'Cannot perform this action');
        break;
      }
      case 'Voting': {
        if (election.stage !== 'RegisterVoters') throw new ApiError(403, 'Cannot perform this action');
        break;
      }
      case 'Finalized': {
        if (election.stage !== 'Voting') throw new ApiError(403, 'Cannot perform this action');
        break;
      }
      default: {
        throw new ApiError(403, 'Cannot perform this action');
      }
    }
    election = await this.client.election.update({ where: { id: election.id }, data: { stage: stage } });
    return {
      id: election.id,
      title: election.title,
      host_address: election.host_address,
      stage: election.stage,
      deadline: election.deadline,
      created_at: election.created_at,
    };
  }

  async updateElectionDeadline(
    election_id: bigint,
    user_address: string,
    deadline: bigint,
  ): Promise<IElectionResponse> {
    let election: IElection | null = await this.client.election.findUnique({ where: { id: election_id } });
    if (election === null) throw new ApiError(404, 'Cannot find election');
    if (election.host_address !== user_address) throw new ApiError(403, 'Unauthorized for this action');
    election = await this.client.election.update({ where: { id: election_id }, data: { deadline: deadline } });
    return election;
  }

  async updateElectionPayout(
    election_id: bigint,
    host_address: string,
    payout: bigint,
  ): Promise<IElectionResponseForHost> {
    const election: IElectionResponse = await this.getElectionById(election_id);
    if (election.host_address !== host_address) throw new ApiError(403, 'Unauthorized for this action');
    const electionForHost = await this.client.election.update({
      where: { id: election_id },
      data: { finalize_payout: payout },
    });
    return {
      id: electionForHost.id,
      title: electionForHost.title,
      host_address: electionForHost.host_address,
      stage: electionForHost.stage,
      deadline: electionForHost.deadline,
      deposit: electionForHost.deposit,
      finalize_payout: electionForHost.finalize_payout,
      created_at: electionForHost.created_at,
    };
  }
}
