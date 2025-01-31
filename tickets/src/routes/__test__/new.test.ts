import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket-model';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(400);
});

it('returns a status code other than 401 if the user is not signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(400);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'new title',
      price: -10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'new title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  // Add in a check to make sure a tickets is saved
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);

  const title = 'new title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  ticket = await Ticket.find({});
  expect(ticket.length).toEqual(1);
  expect(ticket[0].price).toEqual(20);
  expect(ticket[0].title).toEqual(title);
});
it('Publish an event', async () => {
  const title = 'fnlfnw';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
