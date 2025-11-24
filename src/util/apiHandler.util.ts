/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

import { ApiError, ApiResponse } from './api.util';

export function errorHandler(error: any, res: Response): void {
  if (error instanceof ApiError) {
    res.locals.errorMessage = error.message;
    res.locals.errorStack = error.stack;
    res.status(error.getStatusCode()).json(error.toJSON());
  } else {
    res.locals.errorMessage = 'Internal Server Error';
    res.locals.errorStack = '';
    const response = new ApiResponse('Internal Server Error', null, 500);
    res.status(response.getStatusCode()).json(response.toJSON());
  }
}

export function apiHandler(res: Response, status?: number, message?: string, data?: any): void {
  const response = new ApiResponse(message || 'Success', data || null, status || 200);
  res.status(response.getStatusCode()).json(response.toJSON());
}
