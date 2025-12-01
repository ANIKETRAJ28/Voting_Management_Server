import { IElectionNotFound, IElectionResponse } from '../interface/election.interface';
import { ElectionRepository } from '../repository/election.repository';

export class ElectionService {
  private electionRepository: ElectionRepository;

  constructor() {
    this.electionRepository = new ElectionRepository();
  }

  async getElectionsAsCandidature(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return this.electionRepository.getElectionsAsCandidature(id);
  }

  async getElectionsAsVoter(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return this.electionRepository.getElectionsAsVoter(id);
  }

  async getElectionsAsHost(id: string): Promise<(IElectionResponse | IElectionNotFound)[]> {
    return this.electionRepository.getElectionsAsHost(id);
  }
}
