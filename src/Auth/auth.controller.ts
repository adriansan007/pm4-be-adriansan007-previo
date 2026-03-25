import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // =========================
  // 🔐 SIGN UP (Actividad 01)
  // =========================
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`POST /auth/signup -> ${msg}`);
      throw err;
    }
  }

  // =========================
  // 🔐 SIGN IN (Actividad 02)
  // =========================
  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }
}
