import request from 'supertest';
import { app } from '../../app';

it('clears cookie after sign out', async () => {
  // Sign up a user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password123',
    })
    .expect(201);

  // Sign out the user
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  expect(response.get('Set-Cookie')).toEqual([
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly',
  ]);
});
