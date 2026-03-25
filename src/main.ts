import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 Validation global (ya lo tenías perfecto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
      transform: true, // Convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 📘 Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('PM4 Backend Nest API')
    .setDescription(
      'Documentación OpenAPI del proyecto Nest de Adrián Santoro en Henry',
    )
    .setVersion('1.0')
    .addBearerAuth() // 🔐 Soporte para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👉 Ruta: /api

  await app.listen(3000);

  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('📘 Swagger disponible en http://localhost:3000/api');
}

void bootstrap();
