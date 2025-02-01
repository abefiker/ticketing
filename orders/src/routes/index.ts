import express, { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order-model';
import { NotFoundError, requireAuth } from '@abticketing21/common';
const router = express.Router();

router.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');
    if (!orders) {
      throw new NotFoundError();
    }
    res.status(200).send(orders);
  }
);

export { router as indexOrderRouter };
