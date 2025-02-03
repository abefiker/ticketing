import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import {
  currentUser,
  errorHandler,
  NotFoundError,
  logger,
} from '@abticketing21/common';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
);

app.use(currentUser);
logger.info('Starting ticket service');

app.all('*', async (reqRequest, res: Response) => {
  throw new NotFoundError();
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
