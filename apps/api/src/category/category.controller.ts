import { Controller, Post, Put, Patch, Delete, Body } from '@nestjs/common';
import { CreateCategoryDto } from '../../../../packages/dtos/blog-category/create-category.dto';
import { CategoryService } from './category.service'
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    // implement full CRUD operation API for blog category
    @Post('create')
    createCategory(@Body() createCategoryDto: CreateCategoryDto){
        return this.categoryService.createCategory(createCategoryDto);
    }
}
