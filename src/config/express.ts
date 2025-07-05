import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from './cors';
import routes from './routes';
import { successHandler, errorHandler } from '@/lib/morgan';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors);

// Error handling middleware to set custom message
app.use(
  (
    err: { message: string; status?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.locals.errorMessage = err.message; // Attach the error message
    res.status(err.status || 500).json({ error: err.message });
    next(err);
  }
);
app.use(successHandler);
app.use(errorHandler);

app.use(routes);

export = app;
