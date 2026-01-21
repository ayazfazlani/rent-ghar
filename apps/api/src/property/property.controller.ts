import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors, Request , Param, Patch, Delete, Put} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PropertyService } from './property.service'
import { CreatePropertyDto } from '../../../../packages/types/src/property';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
//   @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Request() req,
    @Body() dto: CreatePropertyDto,
  ) {
    // Extract files from request
    const files = req.files as Express.Multer.File[]
    const mainPhoto = files?.find(file => file.fieldname === 'mainPhoto')
    const additionalPhotos = files?.filter(file => file.fieldname === 'additionalPhotos') || []

    // Here you would upload files to Cloudinary/S3 and get URLs
    // For now, just log or mock URLs
    const mainPhotoUrl = mainPhoto ? `http://localhost/uploads/${mainPhoto.filename}` : undefined
    const additionalPhotosUrls = additionalPhotos.map(file => `http://localhost/uploads/${file.filename}`)

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

      // Here you would upload files to Cloudinary/S3 and get URLs
      // For now, just log or mock URLs
      const mainPhotoUrl = mainPhoto ? `http://localhost/uploads/${mainPhoto.filename}` : undefined
      const additionalPhotosUrls = additionalPhotos.length > 0 
        ? additionalPhotos.map(file => `http://localhost/uploads/${file.filename}`)
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
}