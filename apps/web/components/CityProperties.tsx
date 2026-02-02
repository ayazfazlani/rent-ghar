 'use client'
import { useState, useRef } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample property data - aap apne actual data se replace kar sakte hain
const featuredProperties = [
  {
    id: 1,
    name: 'Grand Luxury Residences',
    type: 'Apartments & Penthouses',
    city: 'Multan',
    location: 'Gulgasht Colony, Multan',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070',
    launchPrice: 45000000,
    handover: 'Q3 2027',
    currency: 'PKR'
  },
  {
    id: 2,
    name: 'Pearl Heights Tower',
    type: 'Apartments',
    city: 'Lahore',
    location: 'DHA Phase 8, Lahore',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2071',
    launchPrice: 85000000,
    handover: 'Q2 2028',
    currency: 'PKR'
  },
  {
    id: 3,
    name: 'Oceanic Residences',
    type: 'Apartments',
    city: 'Karachi',
    location: 'Clifton, Karachi',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070',
    launchPrice: 95000000,
    handover: 'Q1 2027',
    currency: 'PKR'
  },
  {
    id: 4,
    name: 'Capital Heights',
    type: 'Apartments',
    city: 'Islamabad',
    location: 'Blue Area, Islamabad',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
    launchPrice: 75000000,
    handover: 'Q4 2027',
    currency: 'PKR'
  },
  {
    id: 5,
    name: 'Sky View Apartments',
    type: 'Apartments',
    city: 'Multan',
    location: 'Cantonment, Multan',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070',
    launchPrice: 38000000,
    handover: 'Q2 2027',
    currency: 'PKR'
  },
  {
    id: 6,
    name: 'Emerald Heights',
    type: 'Apartments',
    city: 'Lahore',
    location: 'Bahria Town, Lahore',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2071',
    launchPrice: 62000000,
    handover: 'Q1 2028',
    currency: 'PKR'
  }
];

const cities = ['All', 'Multan', 'Lahore', 'Karachi', 'Islamabad'];

const CityProperties = () => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredProperties = selectedCity === 'All' 
    ? featuredProperties 
    : featuredProperties.filter(prop => prop.city === selectedCity);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)}M`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`;
    }
    return price.toLocaleString();
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 bg-white relative overflow-hidden">
      {/* Minimal Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-black/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-2">
            Browse New Projects in Pakistan
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Discover premium residential and commercial properties across major cities
          </p>
        </div>

        {/* City Filter Tabs - Horizontal Scroll */}
        <div className="mb-6 animate-fade-in-up overflow-x-auto scrollbar-hide" style={{ animationDelay: '200ms' }}>
          <div className="flex gap-2 justify-center min-w-max px-4">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-black'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards with Scroll */}
        <div className="relative">
          {/* Scroll Arrows - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black text-white p-3 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="group relative bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-500 cursor-pointer animate-fade-in-up flex-shrink-0 w-64 md:w-72 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                {/* Property Image - Very Compact */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* City Badge */}
                  <div className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <MapPin className="w-2.5 h-2.5 text-black" />
                    <span className="text-[10px] font-bold text-black">{property.city}</span>
                  </div>

                  {/* HOT Badge */}
                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    HOT
                  </div>
                </div>

                {/* Property Details - Very Compact */}
                <div className="p-3">
                  {/* Property Name */}
                  <h3 className="text-sm font-bold text-black mb-0.5 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
                    {property.name}
                  </h3>

                  {/* Property Type */}
                  <p className="text-[10px] text-gray-600 mb-2 font-medium line-clamp-1">
                    {property.type}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="line-clamp-1">{property.location}</span>
                  </div>

                  {/* Price & Handover Info - Very Compact */}
                  <div className="grid grid-cols-2 gap-2 mb-2 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-[9px] text-gray-500 mb-0.5 font-medium">Launch Price</p>
                      <p className="text-xs font-bold text-black">
                        {property.currency} {formatPrice(property.launchPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 mb-0.5 font-medium">Handover</p>
                      <p className="text-xs font-bold text-black flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {property.handover}
                      </p>
                    </div>
                  </div>

                  {/* View Button - Compact */}
                  <button
                    className="w-full bg-black hover:bg-gray-800 text-white py-1.5 rounded-lg font-semibold text-[10px] transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.id}`);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator for Mobile */}
          <div className="lg:hidden flex justify-center gap-1 mt-3">
            {Array.from({ length: Math.ceil(filteredProperties.length / 2) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            ))}
          </div>
        </div>

        {/* View All Properties Button */}
        <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <button
            onClick={() => router.push('/properties')}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <span>View All Properties</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Animations & Scrollbar Hide */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CityProperties;