import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const response: ErrorResponse = {
    success: false,
    message: 'Internal server error',
  };

  let statusCode = 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    response.message = 'Validation failed';
    const mongooseErr = err as unknown as Record<string, unknown>;
    if (mongooseErr.errors && typeof mongooseErr.errors === 'object') {
      const errors: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(
        mongooseErr.errors as Record<string, { message: string }>
      )) {
        errors[key] = [val.message];
      }
      response.errors = errors;
    }
  }

  if (
    err.name === 'MongoServerError' &&
    (err as unknown as Record<string, unknown>).code === 11000
  ) {
    statusCode = 409;
    response.message = 'A record with this value already exists';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    response.message = 'Invalid ID format';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    response.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.message = 'Token has expired';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', err);
  }

  res.status(statusCode).json(response);
};
