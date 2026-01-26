// apps/api/src/storage/storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // optional for private files

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly disk: 'local' | 's3';
  private readonly localRoot: string;
  private readonly s3Client?: S3Client;
  private readonly bucket?: string;
  private readonly publicBaseUrl?: string;

  constructor(private config: ConfigService) {
    this.disk = this.config.get('STORAGE_DISK', 'local') as 'local' | 's3';

    this.localRoot = path.join(process.cwd(), '..', '..', 'uploads'); // monorepo root level

    if (this.disk === 's3') {
      this.bucket = this.config.getOrThrow('STORAGE_BUCKET');
      this.publicBaseUrl = this.config.get('STORAGE_PUBLIC_URL'); // e.g. https://img.yourdomain.com

      this.s3Client = new S3Client({
        region: this.config.get('STORAGE_REGION', 'auto'), // 'auto' for R2
        endpoint: this.config.get('STORAGE_ENDPOINT'),     // required for R2 / MinIO
        credentials: {
          accessKeyId: this.config.getOrThrow('STORAGE_KEY'),
          secretAccessKey: this.config.getOrThrow('STORAGE_SECRET'),
        },
        forcePathStyle: true, // important for R2 / MinIO
      });
    }

    // Ensure local dir exists (dev only)
    if (this.disk === 'local') {
      fs.mkdir(this.localRoot, { recursive: true }).catch(() => {});
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'properties', // e.g. 'properties/2026/01'
  ): Promise<string> {
    const ext = path.extname(file.originalname) || '.webp';
    const key = `${folder}/${randomUUID()}${ext}`;

    if (this.disk === 'local') {
      const fullPath = path.join(this.localRoot, key);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.buffer);
      return key;
    }

    // S3 / R2 upload
    await this.s3Client!.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return key;
  }

  getUrl(key: string): string {
    if (this.disk === 'local') {
      return `/uploads/${key}`; // Nest will serve it
    }

    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl}/${key}`;
    }

    // fallback: construct R2 public URL if no custom domain
    const endpoint = this.config.get('STORAGE_ENDPOINT')!;
    const match = endpoint.match(/https:\/\/([^.]+)\.r2\.cloudflarestorage\.com/);
    if (match) {
      return `https://${this.bucket}.${match[1]}.r2.dev/${key}`;
    }

    return `https://${this.bucket}.s3.${this.config.get('STORAGE_REGION')}.amazonaws.com/${key}`;
  }

  // Optional: stream / download method if needed
  // async getStream(key: string) { ... }
}