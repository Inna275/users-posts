import { jest } from '@jest/globals';
import { PostsService } from '../../src/modules/posts/posts.service.js';

describe('PostsService', () => {
  let service;
  let prismaMock;

  const mockPost = {
    id: '1',
    title: 'Clean Code in JS',
    content: 'Avoid magic numbers!',
    userId: '1',
  };

  beforeEach(() => {
    prismaMock = {
      post: {
        create: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findMany: jest.fn(),
      },
    };
    service = new PostsService(prismaMock);
  });

  test('create() should pass data to prisma and return created post', async () => {
    const inputData = {
      title: mockPost.title,
      content: mockPost.content,
      userId: mockPost.userId,
    };

    prismaMock.post.create.mockResolvedValue(mockPost);

    const result = await service.create(inputData);

    expect(prismaMock.post.create).toHaveBeenCalledWith({ data: inputData });
    expect(result).toEqual(mockPost);
  });

  test('findById() should query prisma with correct id and return post', async () => {
    prismaMock.post.findUniqueOrThrow.mockResolvedValue(mockPost);

    const result = await service.findById(mockPost.id);

    expect(prismaMock.post.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: mockPost.id },
    });

    expect(result).toEqual(mockPost);
  });

  test('findAll() should return an array of all posts', async () => {
    const postsList = [mockPost];
    prismaMock.post.findMany.mockResolvedValue(postsList);

    const result = await service.findAll();

    expect(prismaMock.post.findMany).toHaveBeenCalled();
    expect(result).toEqual(postsList);
  });
});
