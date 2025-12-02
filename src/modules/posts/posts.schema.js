const post = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    content: { type: 'string' },
    userId: { type: 'string', format: 'uuid' },
  },
};

const createPost = {
  body: {
    type: 'object',
    required: ['userId', 'title', 'content'],
    properties: {
      userId: { type: 'string', format: 'uuid' },
      title: { type: 'string', minLength: 3 },
      content: { type: 'string', minLength: 1 },
    },
  },
  response: { 201: post },
};

const getPost = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', format: 'uuid' } },
  },
  response: { 200: post },
};

export { createPost, getPost };
