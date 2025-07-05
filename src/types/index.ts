import { Request } from 'express';

type CustomRequestTypes = Partial<{
  body: unknown;
  params: unknown;
  query: unknown;
  resBody: unknown;
}>;

export type MapToRequest<T extends CustomRequestTypes> = Request<
  T['params'],
  T['resBody'],
  T['body'],
  T['query']
>;

export type SuccessResponse<T> = {
  message: string;
  data?: T;
};

export type ErrorResponse = {
  message: string;
  error?: string | null;
};
