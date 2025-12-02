import { usersController } from './users.controller.js';
import { createUser, getUser } from './users.schema.js';

const usersRoutes = async (app) => {
  const c = usersController(app);

  app.post('/', { schema: createUser }, c.create);
  app.get('/:id', { schema: getUser }, c.getById);
  app.get('/', c.list);
};

export { usersRoutes };
