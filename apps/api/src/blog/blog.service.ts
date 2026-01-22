import { Injectable } from '@nestjs/common';
import { Blog } from '@rent-ghar/db/src/schemas/blog.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument } from '@rent-ghar/db/src/schemas/blog.schema';
import { CreateBlogDto } from '../../../../packages/dtos/blog/createblog.dto';
@Injectable()
export class BlogService {
    constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>){}

    async createBlog(createBlogDto: CreateBlogDto){
        const blog = await this.BlogModel.create(createBlogDto)
        return blog.save();
    }
}
