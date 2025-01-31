import request from 'supertest';
import { app } from '../../app';

it('respond with details about current user', async () => {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // Ensure cookie is defined and it's an array
  const cookie = authResponse.get('Set-Cookie');
  if (!cookie || !Array.isArray(cookie)) {
    throw new Error('Cookie is not set or is not an array');
  }

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) // cookie is guaranteed to be an array here
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('respond with null for unauthenticated user', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
