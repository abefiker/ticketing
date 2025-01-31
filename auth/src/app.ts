import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { CurrentUserRouter } from './routes/current-user';
import { SignupRouter } from './routes/signup';
import { SigninRouter } from './routes/signin';
import { SignoutRouter } from './routes/signout';
import { errorHandler, NotFoundError } from '@abticketing/common';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    sameSite: 'strict',
  })
);

app.use(CurrentUserRouter);
app.use(SignupRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.all('*', async (reqRequest, res: Response) => {
  throw new NotFoundError();
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
