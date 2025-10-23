import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable shutdown hooks for graceful cleanup
  app.enableShutdownHooks();

  // Enable CORS
  app.enableCors({
    origin: [
      // Production domains
      'https://profwise.kz',
      'https://www.profwise.kz',
      'https://api.profwise.kz',
      // Test/staging domains
      'https://test.profwise.kz',
      'https://www.test.profwise.kz',
      'https://test-api.profwise.kz',
      // Development/staging
      'http://172.26.195.243:3000',
      'http://172.26.195.243:3001',
      'http://172.26.195.243:3002',
      'http://172.26.195.243:3003',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
