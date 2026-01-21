 'use client'
import { Heart, MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <p className="text-sm">{property.location}</p>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-5 text-gray-600">
          <div className="flex items-center gap-1.5">
            <Bed className="w-5 h-5" />
            <span className="text-sm">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-5 h-5" />
            <span className="text-sm">{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-5 h-5" />
            <span className="text-sm">{property.area}</span>
          </div>
        </div>

        {/* Price and Contact Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">{property.priceLabel || 'Monthly Rent'}</p>
            <p className="text-2xl font-bold text-gray-900">{property.price}</p>
          </div>
          
          <button className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

// Featured Section Component with Arrow Scroll
const FeaturedSection = () => {
  const scroll = (direction) => {
    const container = document.getElementById('properties-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600">
            Discover the best properties for rent in Multan
          </p>
        </div>

        {/* Cards with Arrow Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Scrollable Container */}
          <div
            id="properties-scroll"
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-6 pb-4">
              {featuredProperties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[420px]">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </div>

       </div>

      {/* Hide Scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedSection;