import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@abticketing/common';
import { Order } from '../models/order-model';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Ticket } from '../models/ticket';
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('A valid ticket ID must be provided'),
  ],
  validateRequest,

  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    // Find the tickets the user trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // making sure this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket already reserved');
    }
    // Calculate  an expiretion date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      status: OrderStatus.Created,
      expiresAt: expiration,
      userId: req.currentUser!.id,
      ticket: ticket,
    });
    await order.save();
    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      version: 0,
    });
    res.status(201).send(order);
  }
);
export { router as createOrderRouter };
