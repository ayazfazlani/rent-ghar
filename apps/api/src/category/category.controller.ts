import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CreateCategoryDto } from '../../../../packages/dtos/blog-category/create-category.dto';
import { UpdateCategoryDto } from '../../../../packages/dtos/blog-category/update-category.dto';
import { CategoryService } from './category.service';
import { CategoryDocument } from '../../../../packages/db/src/schemas/category.schema';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    
    // Create a new category
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
        return this.categoryService.createCategory(createCategoryDto);
    }

    // Get all categories
    @Get()
    async getAllCategories(): Promise<CategoryDocument[]> {
        return this.categoryService.findAllCategories();
    }

    // Get category by slug (must come before :id route)
    @Get('slug/:slug')
    async getCategoryBySlug(@Param('slug') slug: string): Promise<CategoryDocument> {
        return this.categoryService.findCategoryBySlug(slug);
    }

    // Get category by ID
    @Get(':id')
    async getCategoryById(@Param('id') id: string): Promise<CategoryDocument> {
        return this.categoryService.findCategoryById(id);
    }

    // Update category
    @Put(':id')
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<CategoryDocument> {
        return this.categoryService.updateCategory(id, updateCategoryDto);
    }

    // Delete category
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategory(@Param('id') id: string): Promise<void> {
        return this.categoryService.deleteCategory(id);
    }
}
