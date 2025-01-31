import request from 'supertest';
import { app } from '../../app';

it('return 400 for invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalid-email',
      password: 'password',
    })
    .expect(400);
});
describe('POST /api/users/signin', () => {
  it('returns 201 for successful signup', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('returns 400 for incorrect email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test1.com', // Nonexistent email
        password: 'password',
      })
      .expect(400);
  });

  it('returns 400 for incorrect password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('returns 400 for missing fields', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signin')
      .send({
        password: 'password',
      })
      .expect(400);
  });
  it('sets a cookie after successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
