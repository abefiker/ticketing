import express, { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/ticket-model';
import { NotFoundError } from '@abticketing/common';
const router = express.Router();

router.get(
  '/api/tickets',
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find({});
    if (!tickets) {
      throw new NotFoundError();
    }
    res.status(200).send(tickets);
  }
);

export { router as indexTicketRouter };
