import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(201);
});
it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'tasdfdjkl;',
      password: 'password',
    })
    .expect(400);
});
it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'passwor',
    })
    .expect(400);
});
it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});
it('its disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
