import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '../../../../packages/db/src/schemas/property.schema';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from '../../../../packages/types/src/property';
@Injectable()
export class PropertyService {
    constructor(@InjectModel(Property.name) private propertyModel: Model<Property>) {}
    async create(userId: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[]) {
        const property = new this.propertyModel({
          ...dto,
          owner: userId,
          mainPhotoUrl,
          additionalPhotosUrls: additionalPhotosUrls || [],
          status: 'pending',
        })
        return property.save()
      }
    
      async findAllApproved() {
        return this.propertyModel.find({ status: 'approved' })
      }
    
      async findAll() {
        return this.propertyModel.find().sort({ createdAt: -1 })
      }

      async findPropertyByid(id: string) {
        const property = await this.propertyModel.findById(id)
        if (!property) {
          throw new NotFoundException(`Property with ID ${id} not found`)
        }
        return property
      }
}
