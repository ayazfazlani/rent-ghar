import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '../../../../packages/db/src/schemas/property.schema';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from '../../../../packages/types/src/property';
import { Area } from '../../../../packages/db/src/schemas/area.schema';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<Property>,
        @InjectModel(Area.name) private areaModel: Model<Area>
    ) {}
    async create(userId: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[]) {
        // Convert string values from FormData to proper types
        const property = new this.propertyModel({
          listingType: dto.listingType,
          propertyType: dto.propertyType,
          area: dto.area, // Area ID (ObjectId as string, Mongoose will convert)
          title: dto.title,
          location: dto.location,
          bedrooms: typeof dto.bedrooms === 'string' ? parseInt(dto.bedrooms, 10) : dto.bedrooms,
          bathrooms: typeof dto.bathrooms === 'string' ? parseInt(dto.bathrooms, 10) : dto.bathrooms,
          areaSize: typeof dto.areaSize === 'string' ? parseInt(dto.areaSize, 10) : dto.areaSize,
          price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
          description: dto.description,
          contactNumber: dto.contactNumber,
          features: dto.features || [],
          owner: userId,
          mainPhotoUrl,
          additionalPhotosUrls: additionalPhotosUrls || [],
          status: 'pending',
        })
        return property.save()
      }
    
      async findAllApproved(filters?: { cityId?: string; areaId?: string }) {
        try {
          const query: any = { status: 'approved' };
          
          if (filters?.areaId) {
            query.area = filters.areaId;
          } else if (filters?.cityId) {
            // If filtering by city, find all areas in that city first
            const areas = await this.areaModel.find({ city: filters.cityId }).select('_id').lean();
            const areaIds = areas.map(a => a._id);
            if (areaIds.length > 0) {
              query.area = { $in: areaIds };
            } else {
              // No areas in this city, return empty result
              return [];
            }
          }
          
          const properties = await this.propertyModel.find(query).sort({ createdAt: -1 }).exec();
          
          // Populate area and city - handle cases where area might be null
          if (properties.length === 0) {
            return [];
          }
          
          // Only populate if area exists
          const propertiesWithArea = properties.filter(p => p.area);
          if (propertiesWithArea.length > 0) {
            try {
              await this.propertyModel.populate(propertiesWithArea, {
                path: 'area',
                select: 'name',
                populate: { 
                  path: 'city', 
                  select: 'name state country'
                }
              });
            } catch (populateError) {
              console.error('Error populating properties:', populateError);
              // Continue without population
            }
          }
          
          return properties;
        } catch (error) {
          console.error('Error in findAllApproved:', error);
          throw error;
        }
      }
    
      async findAll(filters?: { cityId?: string; areaId?: string }) {
        try {
          const query: any = {};
          
          if (filters?.areaId) {
            query.area = filters.areaId;
          } else if (filters?.cityId) {
            // If filtering by city, find all areas in that city first
            const areas = await this.areaModel.find({ city: filters.cityId }).select('_id').lean();
            const areaIds = areas.map(a => a._id);
            if (areaIds.length > 0) {
              query.area = { $in: areaIds };
            } else {
              // No areas in this city, return empty result
              return [];
            }
          }
          
          const properties = await this.propertyModel.find(query).sort({ createdAt: -1 }).exec();
          
          // Populate area and city - handle cases where area might be null
          if (properties.length === 0) {
            return [];
          }
          
          // Only populate if area exists
          const propertiesWithArea = properties.filter(p => p.area);
          if (propertiesWithArea.length > 0) {
            try {
              await this.propertyModel.populate(propertiesWithArea, {
                path: 'area',
                select: 'name',
                populate: { 
                  path: 'city', 
                  select: 'name state country'
                }
              });
            } catch (populateError) {
              console.error('Error populating properties:', populateError);
              // Continue without population
            }
          }
          
          return properties;
        } catch (error) {
          console.error('Error in findAll:', error);
          throw error;
        }
      }

      async findPropertyByid(id: string) {
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
          throw new NotFoundException(`Property with ID ${id} not found`)
        }
        
        // Populate area and city - handle errors gracefully
        try {
          return await this.propertyModel.populate(property, {
            path: 'area',
            select: 'name',
            populate: { 
              path: 'city', 
              select: 'name state country'
            }
          });
        } catch (populateError) {
          console.error('Error populating property:', populateError);
          // Return property without population if populate fails
          return property;
        }
      }

      async updateStatus(id: string) {
        const property = await this.propertyModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).exec();
        return {
          success: true,
          message: 'Property status updated successfully',
          property: property
        }
      }

      async update(id: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[]) {
        try {
          const property = await this.propertyModel.findById(id).exec();
          if (!property) {
            throw new NotFoundException('Property not found');
          }

          // Build update object
          const updateData: any = {
            listingType: dto.listingType,
            propertyType: dto.propertyType,
            area: dto.area,
            title: dto.title,
            location: dto.location,
            bedrooms: typeof dto.bedrooms === 'string' ? parseInt(dto.bedrooms, 10) : dto.bedrooms,
            bathrooms: typeof dto.bathrooms === 'string' ? parseInt(dto.bathrooms, 10) : dto.bathrooms,
            areaSize: typeof dto.areaSize === 'string' ? parseInt(dto.areaSize, 10) : dto.areaSize,
            price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
            description: dto.description,
            contactNumber: dto.contactNumber,
            features: dto.features || [],
          };

          // Only update photos if new ones are provided
          if (mainPhotoUrl) {
            updateData.mainPhotoUrl = mainPhotoUrl;
          }
          if (additionalPhotosUrls && additionalPhotosUrls.length > 0) {
            updateData.additionalPhotosUrls = additionalPhotosUrls;
          }

          const updatedProperty = await this.propertyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
          return updatedProperty;
        } catch (error) {
          console.error('Error updating property:', error);
          throw error;
        }
      }

      async delete(id: string) {
        try {
          const property = await this.propertyModel.findByIdAndDelete(id).exec();
          if (!property) {
            throw new Error('Property not found');
          }
          return {
            success: true,
            message: 'Property deleted successfully'
          };
        } catch (error) {
          console.error('Error deleting property:', error);
          throw error;
        }
      }
}
