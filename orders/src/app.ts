import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from '@abticketing/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { DeleteOrderRouter } from './routes/delete';
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
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(DeleteOrderRouter);

app.all('*', async (reqRequest, res: Response) => {
  throw new NotFoundError();
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
