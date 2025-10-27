import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // === Swagger Config ===
  const config = new DocumentBuilder()
    .setTitle('Toko Kho API')
    .setDescription('API documentation for Toko Kho (NestJS + JWT + TypeORM)')
    .setVersion('1.0')
    .addBearerAuth() // tambahkan Bearer token (JWT)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // === End Swagger Config ===

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`📘 Swagger Docs available at http://localhost:3000/api-docs`);
}
bootstrap();
