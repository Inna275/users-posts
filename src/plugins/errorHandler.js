import fp from 'fastify-plugin';
import { HTTP_STATUS } from '../consts.js';

const errorHandlerPlugin = fp(async (app) => {
  app.setErrorHandler((error, req, reply) => {
    app.log.error(error);

    if (error.code === 'P2002') {
      reply
        .status(HTTP_STATUS.CONFLICT)
        .send({ message: 'Resource already exists', details: error.meta });
      return;
    }

    if (error.code === 'P2025') {
      reply
        .status(HTTP_STATUS.NOT_FOUND)
        .send({ message: 'Resource not found' });
      return;
    }

    reply
      .status(error.statusCode || HTTP_STATUS.INTERNAL_ERROR)
      .send({ message: error.message });
  });
});

export { errorHandlerPlugin };
