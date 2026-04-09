import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query,
  HttpCode, HttpStatus,
  UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { CementRateService } from './cement-rate.service';
import { CreateCementRateDto } from '@rent-ghar/dtos/cement-rate/create-cement-rate.dto';
import { UpdateCementRateDto } from '@rent-ghar/dtos/cement-rate/update-cement-rate.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('cement-rate')
export class CementRateController {
  constructor(private readonly cementRateService: CementRateService) {}

  // Public — fetched by the /today-cement-rate-in-pakistan page
  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
  ) {
    return this.cementRateService.findAll(city, category);
  }

  // Admin — all including inactive
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAllAdmin() {
    return this.cementRateService.findAllAdmin();
  }

  // Admin — get single by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOne(@Param('id') id: string) {
    return this.cementRateService.findById(id);
  }

  // Admin — create
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCementRateDto) {
    return this.cementRateService.create(dto);
  }

  // Admin — update
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateCementRateDto) {
    return this.cementRateService.update(id, dto);
  }

  // Admin — delete
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.cementRateService.remove(id);
  }
}
