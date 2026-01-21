'use client'
import { useState, useRef } from 'react';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: "IT Sector Growth Continues in...",
    excerpt: "Exploring the latest trends in Pakistan's technology sector and its impact on property investment opportunities.",
    date: "20 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Public Holidays 2026: Long Weekends, Festive Vibes...",
    excerpt: "Plan your property visits and viewings around Pakistan's public holidays for maximum convenience.",
    date: "19 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Last Chance to Own at Zameen Ace Mall: Limited...",
    excerpt: "Discover exclusive investment opportunities at one of Lahore's most promising commercial developments.",
    date: "18 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Coming Soon to Spotlight at Property Sales Event",
    excerpt: "Get ready for the biggest property sales event featuring premium listings across major cities.",
    date: "17 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "AI Must Not Replace Human Touch",
    excerpt: "Understanding the role of technology in modern real estate while maintaining the human touch.",
    date: "16 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Top Locations for Property Investment in 2026",
    excerpt: "Explore the most promising areas in Multan, Karachi, and Islamabad for investment.",
    date: "15 January 2026",
    author: "RentGhr Team",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop"
  }
];

const BlogSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-foreground" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map(post => (
              <article 
                key={post.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0 w-80"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
                  <button className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                    Read More
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

 
       </div>
    </section>
  );
};

export default BlogSection;