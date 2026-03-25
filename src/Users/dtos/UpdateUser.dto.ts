import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNumberString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'nuevo@email.com',
    description: 'Correo electrónico actualizado del usuario',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Adrián Santoro',
    description: 'Nombre completo actualizado',
    minLength: 3,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({
    example: 'Password123!',
    description:
      'Nueva contraseña (8-15 caracteres, incluye mayúscula, minúscula, número y carácter especial)',
    minLength: 8,
    maxLength: 15,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
  password?: string;

  @ApiPropertyOptional({
    example: 'Av. Siempre Viva 742',
    description: 'Dirección actualizada',
    minLength: 3,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  @ApiPropertyOptional({
    example: '3511234567',
    description: 'Número de teléfono actualizado (solo números)',
  })
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Argentina',
    description: 'País actualizado',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiPropertyOptional({
    example: 'Córdoba',
    description: 'Ciudad actualizada',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}
