import {
  IElectionNotFound,
  IElectionResponse,
  IElectionResponseWithCandidate,
  IElectionResponseWithCandidateForHost,
} from '../interface/election.interface';
import { ElectionRepository } from '../repository/election.repository';

export class ElectionService {
  private electionRepository: ElectionRepository;

  constructor() {
    this.electionRepository = new ElectionRepository();
  }

  async getElectionDetailById(
    id: bigint,
    user_address: string,
  ): Promise<IElectionResponseWithCandidate | IElectionResponseWithCandidateForHost> {
    return await this.electionRepository.getElectionDetailById(id, user_address);
  }

  async getElectionsAsCandidature(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return await this.electionRepository.getElectionsAsCandidature(id);
  }

  async getElectionsAsVoter(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return await this.electionRepository.getElectionsAsVoter(id);
  }

  async getElectionsAsHost(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return await this.electionRepository.getElectionsAsHost(id);
  }

  async getActiveElectionsForUser(id: string): Promise<IElectionResponse[]> {
    return await this.electionRepository.getActiveElectionsForUser(id);
  }
}
