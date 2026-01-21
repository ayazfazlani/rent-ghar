import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from '../../../../packages/dtos/area/createarea.dto';
import { AreaDocument } from '../../../../packages/db/src/schemas/area.schema';
import { UpdateAreaDto } from '../../../../packages/dtos/area/updatearea.dto';

@Controller('areas')
@UsePipes(new ValidationPipe())
export class AreaController {
    constructor(private readonly areaService: AreaService) {}

    @Post()
    async createArea(@Body() createAreaDto: CreateAreaDto): Promise<AreaDocument> {
        return this.areaService.createArea(createAreaDto);
    }

    @Get()
    async findAllAreas(@Query('cityId') cityId?: string): Promise<AreaDocument[]> {
        if (cityId) {
            return this.areaService.findAreasByCity(cityId);
        }
        return this.areaService.findAllAreas();
    }

    @Get(':id')
    async findAreaById(@Param('id') id: string): Promise<AreaDocument> {
        return this.areaService.findAreaById(id);
    }

    @Put(':id')
    async updateArea(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto): Promise<AreaDocument> {
        return this.areaService.updateArea(id, updateAreaDto);
    }

    @Delete(':id')
    async deleteArea(@Param('id') id: string): Promise<void> {
        await this.areaService.deleteArea(id);
    }
}