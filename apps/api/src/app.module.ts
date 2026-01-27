/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { CityModule } from './city/city.module';
import { AreaModule } from './area/area.module';
import { CategoryModule } from './category/category.module';
import { BlogModule } from './blog/blog.module';
import { StorageModule } from '../../../packages/storage/storage.module';

@Module({
  imports: [
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI') || 'mongodb://localhost:27017/rent-ghar',
      }),
    }),
    AuthModule,
    PropertyModule,
    CityModule,
    AreaModule,
    CategoryModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
