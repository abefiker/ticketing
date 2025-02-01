import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order-model';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
// it('returns 204 if the ticket is with no content', async () => {
//   const id = new mongoose.Types.ObjectId().toHexString(); // Generate valid ObjectId
//   await request(app).get(`/api/tickets/${id}`).send().expect(204);
// });
// it('returns the ticket if the ticket is found', async () => {
//   const title = 'title';
//   const price = 20;

//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({ title, price })
//     .expect(201);

//   const ticketResponse = await request(app)
//     .get(`/api/tickets/${response.body.id}`)
//     .send()
//     .expect(200);

//   expect(ticketResponse.body.title).toEqual(title);
//   expect(ticketResponse.body.price).toEqual(price);
// });
it('return an error if one users tries to fetch other user order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  // make a request to build an order with the ticket
  const user = global.signin();
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', user)
    .send()
    .expect(401);
});
