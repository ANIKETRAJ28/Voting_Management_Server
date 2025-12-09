import { Request, Response } from 'express';

import { IVoter } from '../interface/voter.interface';
import { VoterService } from '../service/voter.service';
import { ApiError } from '../util/api.util';
import { apiHandler, errorHandler } from '../util/apiHandler.util';

export class VoterController {
  private voterService: VoterService;

  constructor() {
    this.voterService = new VoterService();
  }

  async getVoterByElectionIdAndUserAddress(req: Request, res: Response): Promise<void> {
    try {
      const { user_address } = req;
      if (user_address === undefined) throw new ApiError(401, 'Unauthorized request');
      const { id } = req.params;
      const voter: IVoter = await this.voterService.getVoterByElectionIdAndUserAddress(BigInt(id), user_address);
      apiHandler(res, 200, 'Voter fetched successfully', voter);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
