import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { buildApp } from '../../src/app.js';

describe('Posts API integration', () => {
  let app;
  let request;
  let userId;
  let postId;

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

  test('Should create a user first', async () => {
    const res = await request.post('/users').send({
      email: `user-${uuid()}@test.com`,
      name: 'Tester',
    });

    expect(res.status).toBe(201);
    userId = res.body.id;
  });

  test('POST /posts should return 400 if title is too short', async () => {
    const res = await request.post('/posts').send({
      title: 'Hi',
      content: 'Content',
      userId,
    });

    expect(res.status).toBe(400);
  });

  test('POST /posts should return 400 if userId is missing', async () => {
    const res = await request.post('/posts').send({
      title: 'Valid title',
      content: 'Valid content',
    });

    expect(res.status).toBe(400);
  });

  test('POST /posts should return 400 if userId is not a valid UUID', async () => {
    const res = await request.post('/posts').send({
      title: 'Valid title',
      content: 'Valid content',
      userId: '123-not-valid',
    });

    expect(res.status).toBe(400);
  });

  test('POST /posts should create a post in real DB', async () => {
    const res = await request.post('/posts').send({
      title: 'Title',
      content: 'Content',
      userId,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    postId = res.body.id;
  });

  test('GET /posts/:id should return the specific post', async () => {
    const res = await request.get(`/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(postId);
    expect(res.body.title).toBe('Title');
    expect(res.body.userId).toBe(userId);
  });

  test('GET /posts/:id should return 404 for non-existent UUID', async () => {
    const fakeId = uuid();
    const res = await request.get(`/posts/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Resource not found');
  });

  test('GET /posts should return list of posts', async () => {
    const res = await request.get('/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
