import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { buildApp } from '../../src/app.js';

describe('Users API integration', () => {
  let app;
  let request;
  let userId;
  const userEmail = `unique-${uuid()}@test.com`;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    request = supertest(app.server);
  });

  afterAll(async () => {
    const prisma = app.prisma;
    if (userId) await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  test('POST /users should create a new user', async () => {
    const res = await request.post('/users').send({
      email: userEmail,
      name: 'Integration Test'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(userEmail);
    userId = res.body.id;
  });

  test('POST /users should return 409 if email already exists', async () => {
    const res = await request.post('/users').send({
      email: userEmail,
      name: 'Another Name'
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Resource already exists');
  });

  test('POST /users should return 400 for invalid email format', async () => {
    const res = await request.post('/users').send({
      email: 'not-an-email',
      name: 'Tester'
    });

    expect(res.status).toBe(400);
  });

  test('POST /users should return 400 for too short name', async () => {
    const res = await request.post('/users').send({
      email: `new-${uuid()}@test.com`,
      name: 'A'
    });

    expect(res.status).toBe(400);
  });

  test('GET /users/:id should return user by id', async () => {
    const res = await request.get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe(userEmail);
  });

  test('GET /users/:id should return 404 for non-existent id', async () => {
    const res = await request.get(`/users/${uuid()}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Resource not found');
  });

  test('GET /users should return array of users', async () => {
    const res = await request.get('/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
