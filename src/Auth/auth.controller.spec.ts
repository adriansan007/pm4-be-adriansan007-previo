import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================
  // SIGN UP
  // =========================
  describe('signUp', () => {
    it('should call authService.signUp and return its result', async () => {
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

      const expectedResult = {
        id: '1',
        name: dto.name,
        email: dto.email,
      };

      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(dto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
      expect(mockAuthService.signUp).toHaveBeenCalledTimes(1);
    });
  });

  // =========================
  // SIGN IN
  // =========================
  describe('signIn', () => {
    it('should call authService.signIn and return its result', async () => {
      const dto: LoginUserDto = {
        email: 'test@test.com',
        password: '123456',
      };

      const expectedResult = {
        access_token: 'fake-token',
      };

      mockAuthService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(dto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
      expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
    });
  });
});
