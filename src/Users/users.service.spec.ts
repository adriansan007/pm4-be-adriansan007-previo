import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers: Partial<User>[] = [
    { id: '1', email: 'test1@mail.com' },
    { id: '2', email: 'test2@mail.com' },
  ];

  const mockUsersRepository: jest.Mocked<UsersRepository> = {
    getUsers: jest.fn(() => Promise.resolve(mockUsers)),
    getUserById: jest.fn((id: string) =>
      Promise.resolve(mockUsers.find((u) => u.id === id) ?? null),
    ),
    findByEmail: jest.fn((email: string) =>
      Promise.resolve(mockUsers.find((u) => u.email === email) ?? null),
    ),
    createUser: jest.fn((data: Partial<User>) =>
      Promise.resolve({ id: '3', ...data } as User),
    ),
    updateUser: jest.fn((id: string, data: Partial<User>) =>
      Promise.resolve({ id, ...data }),
    ),
    deleteUser: jest.fn((id: string) => Promise.resolve(id === '1')),
  } as unknown as jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const users = await service.getUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('getUserById', () => {
    it('should return a user if exists', async () => {
      const user = await service.getUserById('1');
      expect(user.id).toBe('1');
    });

    it('should throw NotFoundException if not exists', async () => {
      await expect(service.getUserById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser: Partial<User> = {
        email: 'new@mail.com',
        password: '1234',
      };

      const result = await service.createUser(newUser);

      expect(result.email).toBe(newUser.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const newUser: Partial<User> = {
        email: 'test1@mail.com',
      };

      await expect(service.createUser(newUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const updateData: Partial<User> = {
        email: 'updated@mail.com',
      };

      const user = await service.updateUser('1', updateData);

      expect(user.email).toBe(updateData.email);
    });
  });

  describe('deleteUser', () => {
    it('should delete user if exists', async () => {
      const result = await service.deleteUser('1');
      expect(result).toContain('eliminado');
    });

    it('should throw ConflictException if not exists', async () => {
      await expect(service.deleteUser('999')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
