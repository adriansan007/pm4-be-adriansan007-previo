import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly MAX_SIZE = 200 * 1024; // 200 KB
  private readonly ALLOWED_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validar tamaño
    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException(
        `File is too large. Maximum allowed size is 200 KB`,
      );
    }

    // Validar tipo MIME
    if (!this.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.ALLOWED_MIMETYPES.join(
          ', ',
        )}`,
      );
    }

    return file;
  }
}
