import { Controller, Post, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from '../../../../packages/dtos/blog/createblog.dto';
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService){}
    // implement full CRUD operations API for blog

    @Post('create')
    createBlog(@Body() createBlogDto: CreateBlogDto){
        return this.blogService.createBlog(createBlogDto);
    }
}
