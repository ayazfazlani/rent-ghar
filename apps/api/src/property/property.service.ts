import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '../../../../packages/db/src/schemas/property.schema';
import { InjectModel} from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from '../../../../packages/types/src/property';
import { Area } from '../../../../packages/db/src/schemas/area.schema';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<Property>,
        @InjectModel(Area.name) private areaModel: Model<Area>
    ) {}

    private toSlug(value: string): string {
        return value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

    private isValidObjectId(value: unknown): boolean {
        return typeof value === 'string' && Types.ObjectId.isValid(value);
      }

    private isValidAreaRef(area: unknown): boolean {
        if (!area) return false;
        if (typeof area === 'string') return this.isValidObjectId(area);
        if (area instanceof Types.ObjectId) return true;
        if (typeof area === 'object' && '_id' in (area as any)) {
          const id = (area as any)._id;
          return typeof id === 'string' ? this.isValidObjectId(id) : id instanceof Types.ObjectId;
        }
        return false;
      }

    private async ensureSlugForProperties(properties: Property[]) {
        const toUpdate = properties.filter(p => !p.slug && p.title);
        if (toUpdate.length === 0) {
            return;
        }

        await Promise.all(
            toUpdate.map(p => {
                const slug = this.toSlug(p.title);
                p.slug = slug;
                return this.propertyModel.updateOne({ _id: p._id }, { slug }).exec();
            })
        );
    }

    private async ensureSlugForMissingApproved() {
        const missing = await this.propertyModel.find({
            status: 'approved',
            $or: [{ slug: { $exists: false } }, { slug: '' }]
        }).select('_id title slug').exec();
        await this.ensureSlugForProperties(missing);
    }
    async create(userId: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[]) {
        const slug = dto.slug ? this.toSlug(dto.slug) : (dto.title ? this.toSlug(dto.title) : undefined);
        // Convert string values from FormData to proper types
        const property = new this.propertyModel({
          listingType: dto.listingType,
          propertyType: dto.propertyType,
          area: dto.area, // Area ID (ObjectId as string, Mongoose will convert)
          slug,
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
            if (!this.isValidObjectId(filters.areaId)) {
              return [];
            }
            query.area = filters.areaId;
          } else if (filters?.cityId) {
            if (!this.isValidObjectId(filters.cityId)) {
              return [];
            }
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
          await this.ensureSlugForProperties(properties);
          
          // Populate area and city - handle cases where area might be null
          if (properties.length === 0) {
            return [];
          }
          
          // Only populate if area exists
          const propertiesWithArea = properties.filter(p => this.isValidAreaRef(p.area));
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
            if (!this.isValidObjectId(filters.areaId)) {
              return [];
            }
            query.area = filters.areaId;
          } else if (filters?.cityId) {
            if (!this.isValidObjectId(filters.cityId)) {
              return [];
            }
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
          await this.ensureSlugForProperties(properties);
          
          // Populate area and city - handle cases where area might be null
          if (properties.length === 0) {
            return [];
          }
          
          // Only populate if area exists
          const propertiesWithArea = properties.filter(p => this.isValidAreaRef(p.area));
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

      async findPropertyBySlug(slug: string) {
        const normalizedSlug = this.toSlug(slug);
        let property = await this.propertyModel.findOne({ slug: normalizedSlug, status: 'approved' }).exec();
        if (!property) {
          await this.ensureSlugForMissingApproved();
          property = await this.propertyModel.findOne({ slug: normalizedSlug, status: 'approved' }).exec();
        }
        if (!property) {
          throw new NotFoundException(`Property with slug ${slug} not found`)
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

          if (dto.slug) {
            updateData.slug = this.toSlug(dto.slug);
          } else if (dto.title) {
            updateData.slug = this.toSlug(dto.title);
          }

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
