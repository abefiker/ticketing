import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order-model';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
// const createTickets = () => {
//   const title = 'Test ticket';
//   const price = 20;
//   return request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({ title, price });
// };

// it('can fetch a list of tickets', async () => {
//   await createTickets();
//   await createTickets();
//   await createTickets();

//   const response = await request(app).get('/api/tickets');
//   expect(response.status).toEqual(200);
//   expect(response.body.length).toEqual(3);
//   expect(response.body[0].title).toEqual('Test ticket');
// });
const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};
it('fetches orders for particular user', async () => {
  // Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as user number 1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  // Create two orders as user number 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  // Make request to get orders for user number 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);
  console.log(orderOne);
  console.log(orderTwo);
  // Make sure only got the orders for user number 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
