import { Request, Response } from 'express';

import { IElectionNotFound, IElectionResponse } from '../interface/election.interface';
import { ElectionService } from '../service/election.service';
import { ApiError } from '../util/api.util';
import { apiHandler, errorHandler } from '../util/apiHandler.util';

export class ElectionController {
  private electionService: ElectionService;

  constructor() {
    this.electionService = new ElectionService();
  }

  async getElectionAsCandidature(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req;
      if (user_id === undefined) throw new ApiError(401, 'Unauthorized request');
      const elections: (IElectionResponse | IElectionNotFound)[] =
        await this.electionService.getElectionsAsCandidature(user_id);
      apiHandler(res, 200, 'All candidature elections fetched', elections);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getElectionAsVoter(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req;
      if (user_id === undefined) throw new ApiError(401, 'Unauthorized request');
      const elections: (IElectionResponse | IElectionNotFound)[] =
        await this.electionService.getElectionsAsVoter(user_id);
      apiHandler(res, 200, 'All voter elections fetched', elections);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getElectionAsHost(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req;
      if (user_id === undefined) throw new ApiError(401, 'Unauthorized request');
      const elections: (IElectionResponse | IElectionNotFound)[] =
        await this.electionService.getElectionsAsHost(user_id);
      apiHandler(res, 200, 'All host elections fetched', elections);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
