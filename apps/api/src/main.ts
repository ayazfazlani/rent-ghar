import 'reflect-metadata';
import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Serve static files for local storage
  if (process.env.STORAGE_DISK === 'local' || !process.env.STORAGE_DISK) {
    const path = await import('path');
    const join = path.join;
    const express = await import('express');
    const cwd = process.cwd();
    const isInAppsApi =
      cwd.includes(join('apps', 'api')) || cwd.endsWith('apps\\api');
    const uploadsPath = isInAppsApi
      ? join(cwd, '..', '..', 'uploads') // Go up to monorepo root
      : join(cwd, 'uploads'); // Use current directory
    app.use('/uploads/', express.static(uploadsPath));
    console.log(`📁 Serving static files from: ${uploadsPath}`);
  }
  const allowedOrigins = [
    process.env.APP_URL || 'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3005',
    'https://pro.adca.pk',
    'http://pro.adca.pk',
  ];

  // Add Vercel deployment URL for production
  if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  }

  // Add other production domains if specified
  if (
    process.env.FRONTEND_URL &&
    !allowedOrigins.includes(process.env.FRONTEND_URL)
  ) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  console.log('✅ Allowed Origins:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Allow extra properties to avoid errors
      skipMissingProperties: true, // Skip validation for missing properties
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API server is running on http://localhost:${port}`);
}
bootstrap();
