import { IVoter } from '../interface/voter.interface';
import { VoterRepository } from '../repository/voter.repository';

export class VoterService {
  private voterRepository: VoterRepository;

  constructor() {
    this.voterRepository = new VoterRepository();
  }

  async getVoterByElectionIdAndUserAddress(id: bigint, user_address: string): Promise<IVoter> {
    return await this.voterRepository.getVoterByElectionIdAndUserAddress(id, user_address);
  }
}
