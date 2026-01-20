import { Body, Controller, Get, Post, UseGuards, UseInterceptors, Request , Param} from '@nestjs/common'
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
  async findAll() {
    return this.propertyService.findAllApproved()
  }

  @Get('all')
  async findAllProperties() {
    return this.propertyService.findAll()
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
}