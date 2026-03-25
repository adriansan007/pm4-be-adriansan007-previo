import { Module } from '@nestjs/common';
import { FilesController } from './files.controlller'; // ✅ corregido typo
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { ProductsModule } from '../Products/products.module'; // ✅ import ProductsModule

@Module({
  imports: [ProductsModule], // <-- necesario para inyectar ProductsService
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
