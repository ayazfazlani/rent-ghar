import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../../../packages/db/src/schemas/blog.schema';
import { Category, CategorySchema } from '../../../../packages/db/src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Category.name, schema: CategorySchema }
    ])
  ],
  providers: [BlogService],
  controllers: [BlogController]
})
export class BlogModule {}
