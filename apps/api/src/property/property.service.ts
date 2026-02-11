import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Property } from '@rent-ghar/db/schemas/property.schema';
import { InjectModel} from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from '@rent-ghar/types/property';
import { Area } from '@rent-ghar/db/schemas/area.schema';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<Property>,
        @InjectModel(Area.name) private areaModel: Model<Area>,
        private subscriptionService: SubscriptionService,
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
    async create(userId: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[], userRole?: string) {
        // Validation: Verify user exists if not admin (though controller handles auth)
        // Check subscription unless user is admin
        let subscriptionId: string | undefined;
        const fs = require('fs');

        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Start create. User: ${userId}, Role: ${userRole}\n`);

        if (userRole !== 'ADMIN') {
          fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Checking subscription for user ${userId}\n`);
          // SYNC: Before checking subscription, ensure the count is accurate
          const actualCount = await this.propertyModel.countDocuments({ 
            owner: userId,
            // status: { $ne: 'deleted' } // depend on business logic if deleted counts
          }).exec();
          
          await this.subscriptionService.syncPropertyUsage(userId, actualCount);

          const subscriptionCheck = await this.subscriptionService.canCreateProperty(userId);
          
          fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Subscription check result: ${JSON.stringify(subscriptionCheck)}\n`);

          if (!subscriptionCheck.canCreate) {
            throw new ForbiddenException(subscriptionCheck.message || 'No active subscription');
          }
          
          // Increment property count on the subscription
          if (subscriptionCheck.subscription) {
            subscriptionId = subscriptionCheck.subscription._id.toString();
            await this.subscriptionService.incrementPropertyCount(
              subscriptionId
            );
          }
        }

        const slug = dto.slug ? this.toSlug(dto.slug) : (dto.title ? this.toSlug(dto.title) : undefined);
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Generated slug: ${slug}\n`);        
        
        try {
            // Convert string values from FormData to proper types
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Creating property model instance\n`);
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
              latitude: typeof dto.latitude === 'string' ? parseFloat(dto.latitude) : dto.latitude,
              longitude: typeof dto.longitude === 'string' ? parseFloat(dto.longitude) : dto.longitude,
            })
            const saved = await property.save()
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service: Property saved successfully. ID: ${saved._id}\n`);
            return saved;
        } catch (error) {
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Service Error: ${error}\n`);
            // ROLLBACK: If property creation fails, decrement the subscription count
            if (subscriptionId) {
                console.error('Property creation failed, rolling back subscription count');
                await this.subscriptionService.decrementPropertyCount(subscriptionId);
            }
            throw error;
        }
      }
    
      async findAllApproved(filters?: { 
        cityId?: string; 
        areaId?: string;
        priceMin?: number;
        priceMax?: number;
        areaMin?: number;
        areaMax?: number;
        beds?: number;
        baths?: number;
        type?: string;
        purpose?: string;
      }) {
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

          // Price Range Filter
          if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
            query.price = {};
            if (filters.priceMin !== undefined) query.price.$gte = filters.priceMin;
            if (filters.priceMax !== undefined) query.price.$lte = filters.priceMax;
          }

          // Area Size Filter
          if (filters?.areaMin !== undefined || filters?.areaMax !== undefined) {
            query.areaSize = {};
            if (filters.areaMin !== undefined) query.areaSize.$gte = filters.areaMin;
            if (filters.areaMax !== undefined) query.areaSize.$lte = filters.areaMax;
          }

          // Beds Filter
          if (filters?.beds !== undefined) {
            if (filters.beds >= 5) {
                query.bedrooms = { $gte: 5 }; // 5+ logic
            } else {
                query.bedrooms = filters.beds;
            }
          }

          // Baths Filter
          if (filters?.baths !== undefined) {
             if (filters.baths >= 4) {
                query.bathrooms = { $gte: 4 }; // 4+ logic
            } else {
                query.bathrooms = filters.baths;
            }
          }

          // Type Filter
          if (filters?.type && filters.type !== 'all') {
             // Case-insensitive match for property type
             query.propertyType = new RegExp(`^${filters.type}$`, 'i');
          }

          // Purpose Filter
          if (filters?.purpose && filters.purpose !== 'all') {
             // Map frontend 'buy' -> backend 'sale'
             const purposeMap: any = { 'buy': 'sale', 'rent': 'rent' };
             const mappedPurpose = purposeMap[filters.purpose] || filters.purpose;
             query.listingType = mappedPurpose;
          }
          
      const properties = await this.propertyModel.find(query).sort({ createdAt: -1 }).exec();
      
      try {
        await this.ensureSlugForProperties(properties);
      } catch (slugError: any) {
        console.warn('⚠️ Non-critical: Failed to ensure slugs:', slugError.message);
      }
      
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
        } catch (populateError: any) {
          console.warn('⚠️ Non-critical: Error populating properties:', populateError.message);
          // Return properties anyway, even if population fails
        }
      }
      
      return properties;
    } catch (error) {
      console.error('❌ Critical: Error in findAllApproved:', error);
      throw error;
    }
  }
    
      async findAll(filters?: { cityId?: string; areaId?: string }, userId?: string, userRole?: string) {
        try {
          const query: any = {};
          
          // Role-based filtering: AGENT can only see their own properties in the dashboard
          if (userRole === 'AGENT' && userId) {
            query.owner = userId;
          }
          
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
          
          try {
            await this.ensureSlugForProperties(properties);
          } catch (slugError: any) {
            console.warn('⚠️ Non-critical: Failed to ensure slugs in findAll:', slugError.message);
          }
          
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
            } catch (populateError: any) {
              console.warn('⚠️ Non-critical: Error populating properties in findAll:', populateError.message);
            }
          }
          
          return properties;
        } catch (error) {
          console.error('❌ Critical: Error in findAll:', error);
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

      async update(id: string, dto: CreatePropertyDto, mainPhotoUrl?: string, additionalPhotosUrls?: string[], userId?: string, userRole?: string) {
        try {
          const property = await this.propertyModel.findById(id).exec();
          if (!property) {
            throw new NotFoundException('Property not found');
          }

          // Ownership check for non-admins
          if (userRole !== 'ADMIN' && property.owner.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to update this property');
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
            latitude: typeof dto.latitude === 'string' ? parseFloat(dto.latitude) : dto.latitude,
            longitude: typeof dto.longitude === 'string' ? parseFloat(dto.longitude) : dto.longitude,
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

      async delete(id: string, userId?: string, userRole?: string) {
        try {
          const property = await this.propertyModel.findById(id).exec();
          if (!property) {
            throw new NotFoundException('Property not found');
          }

          // Ownership check for non-admins
          if (userRole !== 'ADMIN' && property.owner.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to delete this property');
          }

          await this.propertyModel.findByIdAndDelete(id).exec();
          return {
            success: true,
            message: 'Property deleted successfully'
          };
        } catch (error) {
          console.error('Error deleting property:', error);
          throw error;
        }
      }

      async getLocationStats(city: string, listingType?: string, propertyType?: string): Promise<any> {
        try {
            const cityRegex = new RegExp(`^${city}$`, 'i');
            
            const matchStage: any = { status: 'approved' };
            if (listingType) {
                matchStage.listingType = listingType;
            }
            if (propertyType && propertyType !== 'all') {
                matchStage.propertyType = propertyType;
            }
            
            console.log(`[DEBUG] getLocationStats city: "${city}", listingType: "${listingType}"`);
            console.log(`[DEBUG] matchStage:`, JSON.stringify(matchStage));
            
            const initialCount = await this.propertyModel.countDocuments(matchStage);
            console.log(`[DEBUG] Total approved properties matching type: ${initialCount}`);
            
            if (initialCount > 0) {
                const samples = await this.propertyModel.find(matchStage).limit(3).lean();
                // console.log(`[DEBUG] Sample Properties for city search:`, JSON.stringify(samples.map(p => ({
                //     id: p._id,
                //     city: p.city,
                //     area: p.area,
                //     areaType: typeof p.area
                // }))));
            }
    
            const stats = await this.propertyModel.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'areas',
                        localField: 'area',
                        foreignField: '_id',
                        as: 'areaDetails'
                    }
                },
                { $unwind: { path: '$areaDetails', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'cities',
                        localField: 'areaDetails.city',
                        foreignField: '_id',
                        as: 'cityDetails'
                    }
                },
                { $unwind: { path: '$cityDetails', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        computedCityName: {
                            $ifNull: ['$cityDetails.name', '$city']
                        }
                    }
                },
                {
                    $match: {
                        computedCityName: cityRegex
                    }
                },
                {
                    $addFields: {
                        debug: 'match_city'
                    }
                },
                // Add a temporary stage to log intermediate results if needed, 
                // but for now let's just log the count after aggregation
                {
                    $facet: {
                        locations: [
                            { $match: { 'areaDetails.name': { $exists: true, $ne: null } } },
                            {
                                $group: {
                                    _id: { name: '$areaDetails.name', id: '$areaDetails._id' },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { count: -1 } },
                            {
                                $project: {
                                    name: '$_id.name',
                                    id: '$_id.id',
                                    count: 1,
                                    _id: 0
                                }
                            }
                        ],
                        summary: [
                            {
                                $group: {
                                    _id: '$propertyType',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        listingTypes: [
                             {
                                $group: {
                                    _id: '$listingType',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        total: [
                            { $count: 'count' }
                        ]
                    }
                }
            ]).exec();
    
            const result = stats[0];
            console.log(`[DEBUG] Final Stats for ${city}:`, JSON.stringify({
                locationsCount: result.locations.length,
                summary: result.summary,
                total: result.total[0]?.count || 0
            }));

            return {
                locations: result.locations,
                summary: result.summary.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                listingTypes: result.listingTypes.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                total: result.total[0]?.count || 0
            };
    
        } catch (error) {
            console.error('Error fetching location stats:', error);
            throw error;
        }
      }
}
