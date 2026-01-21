import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Area, AreaDocument } from '../../../../packages/db/src/schemas/area.schema';
import { CreateAreaDto } from '../../../../packages/dtos/area/createarea.dto';
import { UpdateAreaDto } from '../../../../packages/dtos/area/updatearea.dto';

@Injectable()
export class AreaService {
    constructor(
        @InjectModel(Area.name) private areaModel: Model<AreaDocument>
    ) {}
    
    async createArea(createAreaDto: CreateAreaDto): Promise<AreaDocument> {
        // Validate city ID
        if (!isValidObjectId(createAreaDto.city)) {
            throw new NotFoundException('Invalid city ID');
        }

        const createdArea = new this.areaModel({
            name: createAreaDto.name,
            city: createAreaDto.city,
        });
        return await createdArea.save();
    }

    async findAllAreas(): Promise<AreaDocument[]> {
        return await this.areaModel.find().populate('city', 'name state country').sort({ createdAt: -1 }).exec();
    }

    async findAreaById(id: string): Promise<AreaDocument> {
        if (!isValidObjectId(id)) {
            throw new NotFoundException('Invalid area ID');
        }
        const area = await this.areaModel.findById(id).populate('city', 'name state country').exec();
        if (!area) {
            throw new NotFoundException('Area not found');
        }
        return area as AreaDocument;
    }

    async findAreasByCity(cityId: string): Promise<AreaDocument[]> {
        if (!isValidObjectId(cityId)) {
            throw new NotFoundException('Invalid city ID');
        }
        return await this.areaModel.find({ city: cityId }).populate('city', 'name state country').sort({ name: 1 }).exec();
    }

    async updateArea(id: string, updateAreaDto: UpdateAreaDto): Promise<AreaDocument> {
        if (!isValidObjectId(id)) {
            throw new NotFoundException('Invalid area ID');
        }
        const area = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true }).populate('city', 'name state country').exec();
        if (!area) {
            throw new NotFoundException('Area not found');
        }
        return area;
    }
    
    async deleteArea(id: string): Promise<void> {
        if (!isValidObjectId(id)) {
            throw new NotFoundException('Invalid area ID');
        }
        const area = await this.areaModel.findByIdAndDelete(id).exec();
        if (!area) {
            throw new NotFoundException('Area not found');
        }
    }
}