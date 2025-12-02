import { UsersService } from './users.service.js';
import { HTTP_STATUS } from '../../consts.js';

const usersController = (app) => {
  const service = new UsersService(app.prisma);

  return {
    create: async (req, reply) => {
      const user = await service.create(req.body);
      reply.code(HTTP_STATUS.CREATED).send(user);
    },

    getById: async (req) => service.findById(req.params.id),

    list: async () => service.findAll(),
  };
};

export { usersController };
