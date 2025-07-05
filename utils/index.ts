import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse, SuccessResponse } from '@/types';

export const handleSuccess = <T>(
  res: Response,
  message: string,
  statusCode: StatusCodes = StatusCodes.OK,
  data?: T
): void => {
  const response: SuccessResponse<T> = {
    message,
    data
  };
  res.status(statusCode).json(response);
};

export const handleError = (
  res: Response,
  message: string,
  error: unknown = null,
  statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
): void => {
  const response: ErrorResponse = {
    message,
    error: error ? error.toString() : null
  };
  res.status(statusCode).json(response);
};
