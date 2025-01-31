import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
// jest.mock('../../nats-wrapper');
it('returns 204 if the provded ticket id does not exist with provided content', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate valid ObjectId
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updated title',
      price: 20,
    })
    .expect(204);
});
it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate valid ObjectId
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'updated title',
      price: 20,
    })
    .expect(401);
});
it('returns 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'updated title',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'jfwperiowp',
      price: 43,
    })
    .expect(401);
});
it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'updated title',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 43,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'f;sklef',
      price: -43,
    })
    .expect(400);
});
it('updates the ticket provided valid inputs ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'updated title',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'hello',
      price: 43,
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual('hello');
  expect(ticketResponse.body.price).toEqual(43);
});

it('Publish an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'updated title',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'hello',
      price: 43,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
