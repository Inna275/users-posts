import { jest } from '@jest/globals';
import { UsersService } from '../../src/modules/users/users.service.js';

describe('UsersService', () => {
  let service;
  let prismaMock;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@test.com',
    name: 'Test',
  };

  beforeEach(() => {
    prismaMock = {
      user: {
        create: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findMany: jest.fn(),
      },
    };
    service = new UsersService(prismaMock);
  });

  test('create() should pass data to prisma and return created user', async () => {
    const inputData = { email: mockUser.email, name: mockUser.name };
    prismaMock.user.create.mockResolvedValue(mockUser);

    const result = await service.create(inputData);

    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: inputData });
    expect(result).toEqual(mockUser);
  });

  test('should query prisma with correct id and return user', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(mockUser);

    const result = await service.findById(mockUser.id);

    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
    expect(result).toEqual(mockUser);
  });

  test('findAll() should return an array of all users', async () => {
    const users = [mockUser];
    prismaMock.user.findMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(prismaMock.user.findMany).toHaveBeenCalled();
    expect(result).toEqual(users);
  });
});
