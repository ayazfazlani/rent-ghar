import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors, Request, Param, Patch, Delete, Put, UploadedFile } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../../../packages/storage/storage.service';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from '../../../../packages/types/src/property';


@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    // Temporarily commented out to debug DI issue
    private readonly storageService: StorageService
  ) {}

  @Post()
//   @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Request() req,
    @Body() dto: CreatePropertyDto,
  ) {
    // Extract files from request
    const files = req.files as Express.Multer.File[]
    console.log('Received files:', files?.length || 0, 'files');
    const mainPhoto = files?.find(file => file.fieldname === 'mainPhoto')
    const additionalPhotos = files?.filter(file => file.fieldname === 'additionalPhotos') || []

    // Upload files using StorageService OR use existing URLs from body (gallery)
    let mainPhotoUrl: string | undefined;
    if (mainPhoto) {
      console.log('Uploading main photo:', mainPhoto.originalname);
      const key = await this.storageService.upload(mainPhoto, 'properties');
      mainPhotoUrl = this.storageService.getUrl(key);
      console.log('Main photo uploaded:', mainPhotoUrl);
    } else if (req.body.mainPhotoUrl) {
      // If no uploaded main photo but a URL is provided (selected from gallery), use it
      mainPhotoUrl = req.body.mainPhotoUrl;
      console.log('Using existing main photo URL from body:', mainPhotoUrl);
    }
    
    let additionalPhotosUrls: string[] = [];
    if (additionalPhotos.length > 0) {
      console.log('Uploading', additionalPhotos.length, 'additional photos');
      const uploadedUrls = await Promise.all(
        additionalPhotos.map(async (file) => {
          const key = await this.storageService.upload(file, 'properties');
          return this.storageService.getUrl(key);
        })
      );
      additionalPhotosUrls = [...additionalPhotosUrls, ...uploadedUrls];
      console.log('Additional photos uploaded:', uploadedUrls);
    }

    // Merge additional photo URLs coming directly from the body (selected from gallery)
    const bodyAdditional = (req.body.additionalPhotosUrls ??
      req.body['additionalPhotosUrls[]']) as string | string[] | undefined;
    if (bodyAdditional) {
      const bodyUrls = Array.isArray(bodyAdditional) ? bodyAdditional : [bodyAdditional];
      additionalPhotosUrls = [...additionalPhotosUrls, ...bodyUrls];
      console.log('Additional photos URLs from body:', bodyUrls);
    }

    // TODO: Replace with actual user ID from JWT when auth is enabled
    const userId = req.user?.sub || 'temp-user-id'
    const created = await this.propertyService.create(userId, dto, mainPhotoUrl, additionalPhotosUrls)
    return { message: 'Property submitted for approval', property: created }
  }

  @Get()
  async findAll(@Query('cityId') cityId?: string, @Query('areaId') areaId?: string) {
    try {
      const filters: { cityId?: string; areaId?: string } = {};
      if (cityId) filters.cityId = cityId;
      if (areaId) filters.areaId = areaId;
      return await this.propertyService.findAllApproved(filters);
    } catch (error) {
      console.error('Error in findAll controller:', error);
      throw error;
    }
  }

  @Get('all')
  async findAllProperties(@Query('cityId') cityId?: string, @Query('areaId') areaId?: string) {
    const filters: { cityId?: string; areaId?: string } = {};
    if (cityId) filters.cityId = cityId;
    if (areaId) filters.areaId = areaId;
    return this.propertyService.findAll(filters)
  }

  // get property by slug (must be before :id route)
  @Get('slug/:slug')
  async findPropertyBySlug(@Param('slug') slug: string) {
    return await this.propertyService.findPropertyBySlug(slug)
  }

  // get property by id (must be after specific routes like 'all')
  @Get(':id')
  async findPropertyById(@Param('id') id: string) {
    try {
      return await this.propertyService.findPropertyByid(id)
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CreatePropertyDto,
  ) {
    try {
      // Extract files from request
      const files = req.files as Express.Multer.File[]
      const mainPhoto = files?.find(file => file.fieldname === 'mainPhoto')
      const additionalPhotos = files?.filter(file => file.fieldname === 'additionalPhotos') || []

      // Upload files using StorageService
      const mainPhotoUrl = mainPhoto 
        ? this.storageService.getUrl(await this.storageService.upload(mainPhoto, 'properties'))
        : undefined
      const additionalPhotosUrls = additionalPhotos.length > 0
        ? await Promise.all(
            additionalPhotos.map(async (file) => {
              const key = await this.storageService.upload(file, 'properties');
              return this.storageService.getUrl(key);
            })
          )
        : undefined

      const updated = await this.propertyService.update(id, dto, mainPhotoUrl, additionalPhotosUrls)
      return { message: 'Property updated successfully', property: updated }
    } catch (error) {
      console.error('Error in update controller:', error);
      throw error;
    }
  }

  @Patch(':id/update-status')
  async updateStatus(@Param('id') id: string) {
    return await this.propertyService.updateStatus(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.propertyService.delete(id);
    } catch (error) {
      console.error('Error in delete controller:', error);
      throw error;
    }
  }


  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadImage(@Request() req) {
    const files = req.files as Express.Multer.File[];
    const file = files?.[0] || files?.find(f => f.fieldname === 'file');
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    console.log('Uploading file:', file.originalname, 'Size:', file.size, 'bytes');
    const key = await this.storageService.upload(file, 'properties/2026');
    const url = this.storageService.getUrl(key);
    console.log('File uploaded successfully:', key, 'URL:', url);
    return { key, url };
  }

  @Get('images/list')
  async listImages(@Query('folder') folder?: string) {
    try {
      const images = await this.storageService.listFiles(folder || 'properties');
      return { images, count: images.length };
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  @Delete('images/:key')
  async deleteImage(@Param('key') key: string) {
    try {
      // Decode the key (it might be URL encoded)
      const decodedKey = decodeURIComponent(key);
      const deleted = await this.storageService.deleteFile(decodedKey);
      if (deleted) {
        return { message: 'Image deleted successfully', key: decodedKey };
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}