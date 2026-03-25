import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../Auth/roles.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  // 🔒 GET /users (ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo ADMIN)' })
  @ApiOkResponse({ description: 'Lista de usuarios obtenida correctamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado - requiere rol ADMIN' })
  async getAllUsers(): Promise<Partial<User>[]> {
    try {
      return await this.usersService.getUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`GET /users -> ${msg}`);
      throw new InternalServerErrorException(
        'No se pudieron obtener los usuarios',
      );
    }
  }

  // 🔓 GET /users/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'Usuario encontrado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Partial<User>> {
    try {
      const user = await this.usersService.getUserById(id);
      delete user.role;
      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`GET /users/:id -> ${msg}`);
      throw new InternalServerErrorException('No se pudo obtener el usuario');
    }
  }

  // 🔓 PUT /users/:id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'Usuario actualizado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ user: Partial<User>; message: string }> {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      delete updatedUser.role;

      return {
        user: updatedUser,
        message: 'Usuario actualizado correctamente.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`PUT /users/:id -> ${msg}`);
      throw new InternalServerErrorException(
        'No se pudo actualizar el usuario',
      );
    }
  }

  // 🔒 DELETE /users/:id (ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario por ID (solo ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ description: 'Usuario eliminado correctamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado - requiere rol ADMIN' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    try {
      await this.usersService.deleteUser(id);

      return {
        id,
        message: 'Usuario eliminado correctamente.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`DELETE /users/:id -> ${msg}`);
      throw new InternalServerErrorException('No se pudo eliminar el usuario');
    }
  }
}
