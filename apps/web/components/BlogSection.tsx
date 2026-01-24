'use client'
/**
 * BlogSection Component - Homepage Blog Preview
 * 
 * FLOW:
 * 1. Component mounts → Fetches latest 6 published blogs
 * 2. Displays blogs in horizontal scrollable carousel
 * 3. Users can scroll left/right to see more blogs
 */

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { blogApi } from '@/lib/api';
import { transformBlogsToPosts, BlogPost } from '@/lib/utils/blog-utils';
import { Blog } from '@/lib/types/blog';

const BlogSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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

  // SCROLL FUNCTION
  // ===============
  // Handles horizontal scrolling of blog carousel
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Pixels to scroll
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth' // Smooth animation
      });
    }
  };

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
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          
          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-foreground" />
          </button>

          {/* Scrollable Container - Horizontal Scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Map through blog posts and render cards */}
            {blogPosts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <article 
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0 w-80"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-44">
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
                  <div className="p-5">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
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
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;