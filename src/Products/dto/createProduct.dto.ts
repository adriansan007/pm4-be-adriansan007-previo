import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  description: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser un número.' })
  stock: number;

  @IsBoolean({
    message: 'El campo "available" debe ser un valor booleano (true o false).',
  })
  available: boolean;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida.' })
  imgUrl?: string;

  // 🔹 CLAVE para evitar el error 500
  @IsUUID('4', { message: 'categoryId debe ser un UUID válido.' })
  categoryId: string;
}
