import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@abticketing21/common';
it('returns 404 when purchasing an order that does not exist', async () => {
  await request(app).post('/api/payments').set('Cookie', global.signin()).send({
    toke: 'fnlkdfnal',
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });
  expect(404);
});
it('returns 401 when purchasing an order that do not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 0,
  });
  await order.save();
  await request(app).post('/api/payments').set('Cookie', global.signin()).send({
    toke: 'fnlkdfnal',
    orderId: order.id,
  });
  expect(401);
});
it('returns 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId,
    price: 20,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      toke: 'fnlkdfnal',
      orderId: order.id,
    });
  expect(400);
});
