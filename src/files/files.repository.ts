import { Injectable } from '@nestjs/common';
import cloudinary from '../config/cloudinary.config';
import { CloudinaryUploadResult } from './files.types';

@Injectable()
export class FilesRepository {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'uploads' }, (error, result) => {
          if (error) {
            return reject(new Error(error.message));
          }

          if (!result) {
            return reject(new Error('No result returned from Cloudinary'));
          }

          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        })
        .end(file.buffer);
    });
  }
}
