import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { buildApp } from '../../src/app.js';

describe('E2E: users and posts flow', () => {
  let app;
  let request;
  let userId;
  let postId;

  const userData = {
    email: `e2e-${uuid()}@test.com`,
    name: 'End To End User',
  };

  const postData = {
    title: 'Full scenario post',
    content: 'This is a test content for E2E flow',
  };

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

  test('Should execute full flow', async () => {
    const userRes = await request.post('/users').send(userData);

    expect(userRes.status).toBe(201);
    expect(userRes.body).toHaveProperty('id');
    userId = userRes.body.id;

    const postRes = await request.post('/posts').send({ ...postData, userId });

    expect(postRes.status).toBe(201);
    postId = postRes.body.id;
    expect(postRes.body.title).toBe(postData.title);

    const getPostRes = await request.get(`/posts/${postId}`);
    expect(getPostRes.status).toBe(200);
    expect(getPostRes.body.userId).toBe(userId);
    expect(getPostRes.body.content).toBe(postData.content);

    const listPostsRes = await request.get('/posts');
    expect(listPostsRes.status).toBe(200);
    expect(Array.isArray(listPostsRes.body)).toBe(true);

    const foundPost = listPostsRes.body.find((p) => p.id === postId);
    expect(foundPost).toBeDefined();
    expect(foundPost.title).toBe(postData.title);

    const listUsersRes = await request.get('/users');
    expect(listUsersRes.status).toBe(200);
    const foundUser = listUsersRes.body.find((u) => u.id === userId);
    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(userData.email);
  });
});
