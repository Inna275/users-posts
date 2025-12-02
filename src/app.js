import Fastify from 'fastify';
import { prismaPlugin } from './plugins/prisma.js';
import { errorHandlerPlugin } from './plugins/errorHandler.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { postsRoutes } from './modules/posts/posts.routes.js';

const buildApp = async () => {
  const app = Fastify({ logger: true });

  await app.register(prismaPlugin);
  await app.register(errorHandlerPlugin);

  app.register(usersRoutes, { prefix: '/users' });
  app.register(postsRoutes, { prefix: '/posts' });

  return app;
};

export { buildApp };
