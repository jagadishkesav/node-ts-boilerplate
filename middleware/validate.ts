import { NextFunction, Response } from 'express';
import { status } from 'http-status';
import { pick } from 'lodash';
import { z } from 'zod';
import { MapToRequest } from '@/types';
import { handleError } from '@/utils';

type RequestKeys = 'headers' | 'params' | 'query' | 'body';
type ZodShape = { [key: string]: z.ZodTypeAny };

// Type for the complete request schema
type RequestSchema = z.ZodObject<{
  body?: z.ZodObject<ZodShape>;
  query?: z.ZodObject<ZodShape>;
  params?: z.ZodObject<ZodShape>;
  headers?: z.ZodObject<ZodShape>;
}>;

/**
 * Validates request data against the provided Zod schema
 * @param schema - Zod object containing schemas for request parts
 */
export const validate = <T extends RequestSchema>(schema: T) => {
  return (
    req: MapToRequest<z.infer<typeof schema>>,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const schemaKeys = Object.keys(schema.shape) as RequestKeys[];
      const validSchema = pick(schema.shape, schemaKeys) as Record<
        RequestKeys,
        z.ZodObject<ZodShape> | undefined
      >;
      const object = pick(req, schemaKeys) as Record<RequestKeys, unknown>;

      // Handle headers separately
      if (validSchema.headers) {
        const { headers } = req;
        object.headers = headers;
      }

      // Validate each part of the request
      for (const [key, partSchema] of Object.entries(validSchema) as [
        RequestKeys,
        z.ZodObject<ZodShape> | undefined
      ][]) {
        if (!partSchema) continue;
        if (!(key in object)) continue;

        try {
          const value = object[key];
          const result = partSchema.parse(value);
          object[key] = result;
        } catch (error) {
          if (error instanceof z.ZodError) {
            return handleError(res, error.errors[0].message);
          }
          throw error;
        }
      }

      // Assign validated values back to request
      Object.assign(req, object);
      return next();
    } catch (error) {
      return next({
        statusCode: status.BAD_REQUEST,
        message: 'Validation error occurred'
      });
    }
  };
};
