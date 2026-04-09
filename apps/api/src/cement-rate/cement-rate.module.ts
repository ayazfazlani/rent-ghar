import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CementRate, CementRateSchema } from '@rent-ghar/db/schemas/cement-rate.schema';
import { CementRateService } from './cement-rate.service';
import { CementRateController } from './cement-rate.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CementRate.name, schema: CementRateSchema },
    ]),
  ],
  providers: [CementRateService],
  controllers: [CementRateController],
  exports: [CementRateService],
})
export class CementRateModule {}
