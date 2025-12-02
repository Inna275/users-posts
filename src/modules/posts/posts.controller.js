import { PostsService } from './posts.service.js';
import { HTTP_STATUS } from '../../consts.js';

const postsController = (app) => {
  const service = new PostsService(app.prisma);

  return {
    create: async (req, reply) => {
      const post = await service.create(req.body);
      reply.code(HTTP_STATUS.CREATED).send(post);
    },

    getById: async (req) => service.findById(req.params.id),

    list: async () => service.findAll(),
  };
};

export { postsController };
