'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { blogApi } from '@/lib/api';
import { transformBlogsToPosts, BlogPost } from '@/lib/utils/blog-utils';
import { Blog } from '@/lib/types/blog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const BlogSection = () => {
  // STATE: Store blogs fetched from API
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH BLOGS ON MOUNT
  // ====================
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Fetch published blogs from API
        const response = await blogApi.getPublishedBlogs();
        // Transform backend format to frontend format
        const transformed = transformBlogsToPosts(response as Blog[]);
        // Take only first 6 for homepage preview
        setBlogPosts(transformed.slice(0, 6));
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // On error, set empty array (component will show nothing)
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Run once on mount

  // LOADING STATE
  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // DON'T RENDER IF NO BLOGS
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Latest Property News
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest trends and insights from Pakistan's property market
          </p>
        </div>

        {/* Blog Cards with Navigation */}
        <div className="relative sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.map((post, index) => (
                <CarouselItem
                  key={post.id || index}
                  className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <article
                      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-48 w-full">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {post.author}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Read More */}
                        <div className="mt-auto flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                          Read More
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;