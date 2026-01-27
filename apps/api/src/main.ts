/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // main.ts
  if (process.env.STORAGE_DISK === 'local') {
    const { join } = await import('path');
    // Use 'express.static' directly since 'useStaticAssets' is not on app
    const express = await import('express');
    app.use(
      '/uploads/',
      express.static(join(__dirname, '..', '..', 'uploads'))
    );
  }
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Allow extra properties to avoid errors
      skipMissingProperties: true, // Skip validation for missing properties
    }
  ));
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API server is running on http://localhost:${port}`);
}
bootstrap();
