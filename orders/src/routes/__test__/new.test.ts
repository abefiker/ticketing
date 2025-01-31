import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order-model';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@abticketing/common';
import mongoose from 'mongoose';

// it('has a route handler listening to /api/orders for POST requests', async () => {
//   const response = await request(app).post('/api/orders').send({});
//   expect(response.status).not.toEqual(404);
// });

// it('can only be accessed if the user is signed in', async () => {
//   await request(app).post('/api/orders').send({}).expect(401);
// });

// it('returns an error if an invalid ticketId is provided', async () => {
//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: 'invalid-ticket-id' })
//     .expect(400);
// });

// it('returns an error if the ticket does not exist', async () => {
//   const ticketId = new mongoose.Types.ObjectId().toHexString();
//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId })
//     .expect(404);
// });

// it('returns an error if the ticket is already reserved', async () => {
//   const ticket = Ticket.build({
//     title: 'concert',
//     price: 20,
//   });
//   await ticket.save();

//   const order = Order.build({
//     ticket,
//     userId: 'testUserId',
//     status: OrderStatus.Created,
//     expiresAt: new Date(),
//   });
//   await order.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(400);
// });

// it('creates an order with valid inputs', async () => {
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 100,
//   });
//   await ticket.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201);

//   const orders = await Order.find({});
//   expect(orders.length).toEqual(1);
//   expect(orders[0].ticket.id).toEqual(ticket.id);
// });

// it('publishes an order created event', async () => {
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 100,
//   });
//   await ticket.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

it('returns an error if the tickets does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(204);
});
it('returns an error if the tickets it already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: 'fjerliowp',
    ticket: ticket,
  });
  await order.save();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(204);
});
it('reserve a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});
it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
