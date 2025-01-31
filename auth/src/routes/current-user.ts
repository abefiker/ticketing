import express, { Request, Response } from 'express';
import { currentUser } from '@abticketing/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response): void => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as CurrentUserRouter };
