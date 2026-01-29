import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve static files for local storage
  if (process.env.STORAGE_DISK === 'local' || !process.env.STORAGE_DISK) {
    const { join } = await import('path');
    const express = await import('express');
    const cwd = process.cwd();
    const isInAppsApi = cwd.includes(join('apps', 'api')) || cwd.endsWith('apps\\api');
    const uploadsPath = isInAppsApi 
      ? join(cwd, '..', '..', 'uploads') // Go up to monorepo root
      : join(cwd, 'uploads'); // Use current directory
    app.use(
      '/uploads/',
      express.static(uploadsPath)
    );
    console.log(`📁 Serving static files from: ${uploadsPath}`);
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
