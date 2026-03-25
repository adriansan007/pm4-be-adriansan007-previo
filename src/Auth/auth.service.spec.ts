jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../Users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =========================
  // SIGN UP
  // =========================
  describe('signUp', () => {
    const dto: CreateUserDto = {
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
      address: 'Test address',
      phone: '123456789',
      country: 'Test country',
      city: 'Test city',
    };

    it('should create user successfully and remove password from response', async () => {
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = {
        id: '1',
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        address: dto.address,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        role: 'user',
      };

      mockUsersService.createUser.mockResolvedValue(createdUser);

      const result = await service.signUp(dto);

      expect(result).not.toHaveProperty('password');
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockUsersService.createUser).toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords are missing', async () => {
      const invalidDto: CreateUserDto = {
        ...dto,
        password: '',
        confirmPassword: '',
      };

      await expect(service.signUp(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto: CreateUserDto = {
        ...dto,
        confirmPassword: 'different',
      };

      await expect(service.signUp(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if createUser fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      mockUsersService.createUser.mockRejectedValue(new Error());

      await expect(service.signUp(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // =========================
  // SIGN IN
  // =========================
  describe('signIn', () => {
    const loginDto: LoginUserDto = {
      email: 'test@test.com',
      password: '123456',
    };

    it('should return access token if credentials are valid', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        password: 'hashedPassword',
        role: 'user',
      };

      mockUsersService.getUserByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwtService.signAsync.mockResolvedValue('fake-jwt-token');

      const result = await service.signIn(loginDto);

      expect(result).toEqual({ access_token: 'fake-jwt-token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await expect(service.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        password: 'hashedPassword',
        role: 'user',
      };

      mockUsersService.getUserByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
