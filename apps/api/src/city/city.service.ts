import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    
    // implement crud operations for city - check for duplicate by name only (name must be unique globally)
    async createCity(createCityDto: CreateCityDto): Promise<CityDocument> {
        try {
            const normalizedName = createCityDto.name.toLowerCase().trim();
            // Convert empty strings to undefined
            const normalizedState = createCityDto.state?.trim() ? createCityDto.state.toLowerCase().trim() : undefined;
            const normalizedCountry = createCityDto.country?.trim() ? createCityDto.country.toLowerCase().trim() : undefined;
            
            // Check if city with this name already exists (name must be unique)
            const existingCity = await this.cityModel.findOne({ 
                name: normalizedName
            }).exec();
            
            if (existingCity){
               throw new BadRequestException('City with this name already exists')
            }
            
            const cityData: any = {
                name: normalizedName
            };
            
            if (normalizedState) {
                cityData.state = normalizedState;
            }
            
            if (normalizedCountry) {
                cityData.country = normalizedCountry;
            }
            
            const createdCity = new this.cityModel(cityData);
            return await createdCity.save();
        } catch (error: any) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000 || error.codeName === 'DuplicateKey') {
                throw new BadRequestException('City with this name already exists');
            }
            // Re-throw if it's already a BadRequestException
            if (error instanceof BadRequestException) {
                throw error;
            }
            // Log and re-throw other errors
            console.error('Error creating city:', error);
            throw error;
        }
    }

    async findAllCities(): Promise<CityDocument[]> {
        try {
            return await this.cityModel.find().sort({ createdAt: -1 }).exec();
        } catch (error) {
            console.error('Error in findAllCities:', error);
            throw error;
        }
    }

    async findCityById(id: string): Promise<CityDocument> {
        const city = await this.cityModel.findById(id).exec();
        if (!city) {
            throw new NotFoundException('City not found');
        }
        return city as CityDocument;
    }

    async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<CityDocument> {
        try {
            // Check if city exists
            const existingCity = await this.cityModel.findById(id).exec();
            if (!existingCity) {
                throw new NotFoundException('City not found');
            }

            // If updating name, check for duplicates by name only (name must be unique globally)
            const updateData: any = {};
            
            if (updateCityDto.name) {
                const newName = updateCityDto.name.toLowerCase().trim();
                // Check if another city with this name exists (excluding current city)
                const duplicateCity = await this.cityModel.findOne({
                    name: newName,
                    _id: { $ne: id } // Exclude current city
                }).exec();

                if (duplicateCity) {
                    throw new BadRequestException('City with this name already exists');
                }
                updateData.name = newName;
            }
            
            // Handle state - allow setting to empty string to clear it
            if (updateCityDto.state !== undefined) {
                const trimmedState = updateCityDto.state.trim();
                updateData.state = trimmedState ? trimmedState.toLowerCase() : undefined;
            }
            
            // Handle country - allow setting to empty string to clear it
            if (updateCityDto.country !== undefined) {
                const trimmedCountry = updateCityDto.country.trim();
                updateData.country = trimmedCountry ? trimmedCountry.toLowerCase() : undefined;
            }

            const city = await this.cityModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            if (!city) {
                throw new NotFoundException('City not found');
            }
            return city;
        } catch (error: any) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000 || error.codeName === 'DuplicateKey') {
                throw new BadRequestException('City with this name already exists');
            }
            // Re-throw if it's already a known exception
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            // Log and re-throw other errors
            console.error('Error updating city:', error);
            throw error;
        }
    }
    
    async deleteCity(id: string): Promise<void> {
        const city = await this.cityModel.findByIdAndDelete(id).exec();
        if (!city) {
            throw new NotFoundException('City not found');
        }
    }
}
