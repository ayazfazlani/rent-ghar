import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from '../../../../packages/db/src/schemas/city.schema';
import { CreateCityDto } from '../../../../packages/dtos/city/createcity.dto';
import { UpdateCityDto } from '../../../../packages/dtos/city/updatecity.dto';

@Injectable()
export class CityService {
    constructor(
        @InjectModel(City.name) private cityModel: Model<CityDocument>
    ) {}
    
    // implement crud operations for city
    async createCity(createCityDto: CreateCityDto): Promise<CityDocument> {
        const createdCity = new this.cityModel(createCityDto);
         return await createdCity.save();
    }

    async findAllCities(): Promise<CityDocument[]> {
        return await this.cityModel.find().sort({ createdAt: -1 }).exec();
    }

    async findCityById(id: string): Promise<CityDocument> {
        const city = await this.cityModel.findById(id).exec();
        if (!city) {
            throw new NotFoundException('City not found');
        }
        return city as CityDocument;
    }

    async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<CityDocument> {
        const city = await this.cityModel.findByIdAndUpdate(id, updateCityDto, { new: true }).exec();
        if (!city) {
            throw new NotFoundException('City not found');
        }
        return city;
    }
    
    async deleteCity(id: string): Promise<void> {
        const city = await this.cityModel.findByIdAndDelete(id).exec();
        if (!city) {
            throw new NotFoundException('City not found');
        }
    }
}
