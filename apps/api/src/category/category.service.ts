import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '@rent-ghar/db/src/schemas/category.schema';
import { CreateCategoryDto } from '../../../../packages/dtos/blog-category/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}
    
    async createCategory(createcategorydto: CreateCategoryDto){
        const category = await this.categoryModel.create(createcategorydto);
        return category;
    }
}
