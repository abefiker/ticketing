import express, { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order-model';
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@abticketing/common';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
