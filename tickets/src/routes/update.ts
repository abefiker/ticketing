import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket-model';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@abticketing/common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is must be provided  '),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Password must be greater than zero'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
