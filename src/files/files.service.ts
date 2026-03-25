import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { ProductsService } from '../Products/products.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly productsService: ProductsService,
  ) {}

  async uploadProductImage(productId: string, file: Express.Multer.File) {
    // 1️⃣ Verificar que el producto exista
    const product = await this.productsService.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2️⃣ Subir imagen a Cloudinary
    const result = await this.filesRepository.uploadImage(file);

    // 3️⃣ Actualizar producto con la URL de la imagen
    product.imgUrl = result.secure_url;

    // 4️⃣ Guardar cambios en DB
    await this.productsService.updateProductImage(productId, product.imgUrl);

    // 5️⃣ Respuesta limpia
    return {
      message: 'Product image updated successfully',
      imgUrl: product.imgUrl,
    };
  }
}
