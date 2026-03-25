import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileValidationPipe } from '../pipes/min-size-validator.pipe';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))

  @ApiOperation({
    summary: 'Subir imagen de un producto (requiere autenticación)',
  })

  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: 'b7c2f3d4-9e4a-4c8a-a3e2-1f4a8d2c9876',
  })

  @ApiConsumes('multipart/form-data')

  @ApiBody({
    description: 'Archivo de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @ApiResponse({
    status: 200,
    description: 'Imagen subida correctamente',
    schema: {
      example: {
        message: 'Imagen subida correctamente',
        imageUrl:
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
    },
  })

  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })

  async uploadProductImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(id, file);
  }
}
