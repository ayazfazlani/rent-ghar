 'use client'
import { Heart, MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type FeaturedProperty = {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  priceLabel?: string;
  beds: number;
  baths: number;
  area: string;
  slug?: string;
};

const PropertyCard = ({ property }: { property: FeaturedProperty }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
      <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
        <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden group cursor-pointer">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Toggle favorite"
            title="Toggle favorite"
            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md z-10"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>
      </Link>

      <div className="p-3 sm:p-3.5 md:p-4">
        <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0" />
          <p className="text-[10px] sm:text-xs truncate">{property.location}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2 sm:mb-3 text-gray-600">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap">{property.beds}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap">{property.baths}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap">{property.area}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-[9px] sm:text-[10px] text-gray-500 mb-0.5">{property.priceLabel || 'Monthly Rent'}</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{property.price}</p>
          </div>
          
          <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
            <button className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-black text-white rounded-md text-[10px] sm:text-xs font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg whitespace-nowrap flex-shrink-0">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = () => {
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('properties-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const featuredProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      title: 'Modern Villa with Garden',
      location: 'Bosan Road, Multan',
      price: 'Rs. 45,000',
      priceLabel: 'Monthly Rent',
      beds: 4,
      baths: 3,
      area: '2500 sq ft'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      title: 'Studio Flat',
      location: 'Gulgasht Colony, Multan',
      price: 'Rs. 18,000',
      priceLabel: 'Monthly Rent',
      beds: 1,
      baths: 1,
      area: '600 sq ft'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      title: 'Luxury Apartment',
      location: 'Cantt Area, Multan',
      price: 'Rs. 55,000',
      priceLabel: 'Monthly Rent',
      beds: 3,
      baths: 2,
      area: '1800 sq ft'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      title: 'Beautiful House',
      location: 'Shah Rukn-e-Alam Colony, Multan',
      price: 'Rs. 65,000',
      priceLabel: 'Monthly Rent',
      beds: 5,
      baths: 4,
      area: '3000 sq ft'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      title: 'Family Home',
      location: 'Model Town, Multan',
      price: 'Rs. 40,000',
      priceLabel: 'Monthly Rent',
      beds: 3,
      baths: 2,
      area: '1500 sq ft'
    }
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Featured Properties
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Discover the best properties for rent in Multan
          </p>
        </div>
<div className="relative">
  {/* Scroll Buttons - Overlapping on cards */}
  <button
    onClick={() => scroll('left')}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
    aria-label="Scroll left"
  >
    <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
  </button>

  <button
    onClick={() => scroll('right')}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
    aria-label="Scroll right"
  >
    <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
  </button>

  <div
    id="properties-scroll"
    className="overflow-x-auto scrollbar-hide scroll-smooth"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    <div className="flex gap-3 sm:gap-3.5 md:gap-4 pb-4">
      {featuredProperties.map((property) => (
        <div key={property.id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  </div>
</div>
       </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedSection;