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
      const scrollAmount = 300; // Pixels to scroll
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth' // Smooth animation
      });
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
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
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Compact */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-2">
            Latest Property News
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Stay updated with the latest trends and insights from Pakistan's property market
          </p>
        </div>

        {/* Blog Cards with Navigation */}
        <div className="relative">
          {/* Left Arrow Button - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Right Arrow Button - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container - Horizontal Scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Map through blog posts and render cards */}
            {blogPosts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <article 
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0 w-64 md:w-72 hover:scale-[1.02]"
                >
                  {/* Image - Compact */}
                  <div className="relative overflow-hidden h-36">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <span className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Content - Compact */}
                  <div className="p-3">
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" />
                        {post.author}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm font-bold text-black mb-1 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-[10px] text-gray-600 mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More Button */}
                    <div className="flex items-center gap-1 text-black text-[10px] font-semibold group-hover:gap-2 transition-all pt-2 border-t border-gray-200">
                      <span>Read More</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Scroll Indicator for Mobile */}
          <div className="lg:hidden flex justify-center gap-1 mt-3">
            {Array.from({ length: Math.ceil(blogPosts.length / 2) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;