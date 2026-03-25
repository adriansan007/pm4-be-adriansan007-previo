import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../Users/users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { User } from '../Users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // 🔐 SIGN UP
  // =========================
  async signUp(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { password, confirmPassword, ...userData } = createUserDto;

    if (!password || !confirmPassword) {
      throw new BadRequestException(
        'Password y confirmPassword son obligatorios',
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersService.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Quitamos password de la respuesta
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }
  }

  // =========================
  // 🔐 SIGN IN
  // =========================
  async signIn(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ Payload con role
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
