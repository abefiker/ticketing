import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, logger } from '@abticketing21/common';
import { Ticket } from '../models/ticket-model';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
router.post(
  '/api/tickets',
  [
    body('title').not().isEmpty().withMessage('Title is must be provided  '),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    logger.info('Creating a new ticket', { title, price });
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);
export { router as createTicketRouter };
