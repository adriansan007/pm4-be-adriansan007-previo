import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'adrian@email.com',
    description: 'Correo electrónico único del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Adrián Santoro',
    description: 'Nombre completo del usuario',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Contraseña segura (8-15 caracteres, incluye mayúscula, minúscula, número y carácter especial)',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Confirmación de la contraseña',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 742',
    description: 'Dirección del usuario',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    example: '3511234567',
    description: 'Número de teléfono (solo números)',
  })
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'País de residencia',
    minLength: 5,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  @ApiProperty({
    example: 'Córdoba',
    description: 'Ciudad de residencia',
    minLength: 5,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;
}
