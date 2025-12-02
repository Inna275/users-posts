const user = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
  },
};

const createUser = {
  body: {
    type: 'object',
    required: ['email', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string', minLength: 2 },
    },
  },
  response: { 201: user },
};

const getUser = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', format: 'uuid' } },
  },
  response: { 200: user },
};

export { createUser, getUser };
