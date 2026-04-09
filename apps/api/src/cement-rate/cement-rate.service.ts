import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CementRate, CementRateDocument } from '@rent-ghar/db/schemas/cement-rate.schema';
import { CreateCementRateDto } from '@rent-ghar/dtos/cement-rate/create-cement-rate.dto';
import { UpdateCementRateDto } from '@rent-ghar/dtos/cement-rate/update-cement-rate.dto';

@Injectable()
export class CementRateService {
  constructor(
    @InjectModel(CementRate.name)
    private cementRateModel: Model<CementRateDocument>,
  ) {}

  async findAll(city?: string, category?: string): Promise<CementRateDocument[]> {
    const query: any = { isActive: true };
    if (city) query.city = city;
    if (category) query.category = category;
    return this.cementRateModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findAllAdmin(): Promise<CementRateDocument[]> {
    return this.cementRateModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<CementRateDocument> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const rate = await this.cementRateModel.findById(id).exec();
    if (!rate) throw new NotFoundException('Cement rate not found');
    return rate;
  }

  async create(dto: CreateCementRateDto): Promise<CementRateDocument> {
    const rate = new this.cementRateModel(dto);
    return rate.save();
  }

  async update(id: string, dto: UpdateCementRateDto): Promise<CementRateDocument> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const rate = await this.cementRateModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!rate) throw new NotFoundException('Cement rate not found');
    return rate;
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const rate = await this.cementRateModel.findByIdAndDelete(id).exec();
    if (!rate) throw new NotFoundException('Cement rate not found');
  }
}
