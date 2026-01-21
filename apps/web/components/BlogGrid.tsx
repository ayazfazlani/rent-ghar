 'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: "IT Sector Growth Continues in Pakistan",
    excerpt: "Exploring the latest trends in Pakistan's technology sector and its impact on property investment opportunities.",
    date: "20 January 2026",
    author: "RentGhr Team",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Public Holidays 2026: Long Weekends, Festive Vibes...",
    excerpt: "Plan your property visits and viewings around Pakistan's public holidays for maximum convenience.",
    date: "19 January 2026",
    author: "RentGhr Team",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=500&fit=crop",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Last Chance to Own at Zameen Ace Mall: Limited...",
    excerpt: "Discover exclusive investment opportunities at one of Lahore's most promising commercial developments.",
    date: "18 January 2026",
    author: "RentGhr Team",
    category: "Property Spotlight",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Coming Soon to Spotlight at Property Sales Event",
    excerpt: "Get ready for the biggest property sales event featuring premium listings across major cities.",
    date: "17 January 2026",
    author: "RentGhr Team",
    category: "Events",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "AI Must Not Replace Human Touch in Real Estate",
    excerpt: "Understanding the role of technology in modern real estate while maintaining the human touch.",
    date: "16 January 2026",
    author: "RentGhr Team",
    category: "Industry News",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "Top Locations for Property Investment in 2026",
    excerpt: "Explore the most promising areas in Multan, Karachi, and Islamabad for investment.",
    date: "15 January 2026",
    author: "RentGhr Team",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop",
    readTime: "8 min read"
  },
  {
    id: 7,
    title: "Smart Home Technology in Modern Properties",
    excerpt: "How smart home features are becoming essential in today's real estate market.",
    date: "14 January 2026",
    author: "RentGhr Team",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 8,
    title: "Understanding Property Taxation in Pakistan",
    excerpt: "A comprehensive guide to property taxes and legal requirements for homeowners.",
    date: "13 January 2026",
    author: "RentGhr Team",
    category: "Legal & Finance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
    readTime: "6 min read"
  },
  {
    id: 9,
    title: "Rental Market Trends for 2026",
    excerpt: "Analysis of rental prices and tenant preferences across major Pakistani cities.",
    date: "12 January 2026",
    author: "RentGhr Team",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=500&fit=crop",
    readTime: "7 min read"
  }
];

const categories = ['All', 'Market Insights', 'Tips & Guides', 'Property Spotlight', 'Events', 'Industry News', 'Technology', 'Legal & Finance'];

const BlogGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visiblePosts, setVisiblePosts] = useState(9);

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const displayedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  const loadMore = () => {
    setVisiblePosts(prev => prev + 9);
  };

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header with Filter and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          {/* Category Filter - Premium Smooth Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setVisiblePosts(9);
                }}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-500 overflow-hidden group ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {/* Smooth Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full transition-transform duration-700 ${
                  selectedCategory !== category ? 'group-hover:translate-x-full' : ''
                }`} />
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                  selectedCategory === category 
                    ? 'bg-primary/20 blur-xl' 
                    : 'bg-transparent group-hover:bg-primary/5 group-hover:blur-md'
                }`} />
                
                {/* Text */}
                <span className="relative z-10">{category}</span>
                
                {/* Bottom Border Animation */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-transform duration-500 ${
                  selectedCategory === category 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground font-semibold">{displayedPosts.length}</span> of <span className="text-foreground font-semibold">{filteredPosts.length}</span> articles
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog Grid - Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article 
                    className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full flex flex-col"
                    style={{ 
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` 
                    }}
                  >
                    {/* Image - Smaller */}
                    <div className="relative overflow-hidden h-44">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      
                      {/* Category Badge - Smaller */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium rounded-md shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content - Compact */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Meta Info - Smaller */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      {/* Title - Smaller */}
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt - Smaller */}
                      <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      
                      {/* Read More - Inline */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User size={12} />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                          Read
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-secondary/20 rounded-2xl">
                <p className="text-muted-foreground text-base mb-4">
                  No posts found in this category.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCategory('All')}
                  className="gap-2"
                >
                  View All Posts
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Load More & Info */}
          <aside className="lg:w-80 space-y-6">
            {/* Load More Card */}
            {hasMore && (
              <div className="bg-card border border-border/50 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  More Articles Available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredPosts.length - visiblePosts} more articles in this category
                </p>
                <Button 
                  onClick={loadMore}
                  className="w-full gap-2 relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/30 group"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">Load More</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* End Message */}
            {!hasMore && filteredPosts.length > 0 && (
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Grid3x3 className="text-primary" size={24} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    All Caught Up!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You've seen all articles in this category
                  </p>
                </div>
              </div>
            )}

            {/* Categories Overview */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4">
                Popular Topics
              </h3>
              <div className="space-y-2">
                {categories.slice(1, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisiblePosts(9);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Smooth Slide Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <span className="relative z-10">{cat}</span>
                    
                    {/* Arrow on Hover */}
                    <ArrowRight 
                      size={14} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-primary" 
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default BlogGrid;