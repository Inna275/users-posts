import { postsController } from './posts.controller.js';
import { createPost, getPost } from './posts.schema.js';

const postsRoutes = async (app) => {
  const c = postsController(app);

  app.post('/', { schema: createPost }, c.create);
  app.get('/:id', { schema: getPost }, c.getById);
  app.get('/', c.list);
};

export { postsRoutes };
