'use client'
import { Heart, MapPin, Bed, Bath, Maximize, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type FeaturedProperty = {
  id: string | number;
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
  // const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
        <div className="relative h-64 overflow-hidden group cursor-pointer">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Toggle favorite"
            title="Toggle favorite"
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
            />
          </button> */}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <p className="text-sm">{property.location}</p>
        </div>

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

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">{property.priceLabel || 'Monthly Rent'}</p>
            <p className="text-2xl font-bold text-gray-900">{property.price}</p>
          </div>

          <Link href={`/properties/${property.slug || toSlug(property.title)}`}>
            <button className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = () => {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await propertyApi.getAll();
        const backendProperties: BackendProperty[] = Array.isArray(response)
          ? response
          : (response as any).properties || [];

        const allProperties = backendProperties.map(mapBackendToFrontendProperty);

        // Get approved properties only and limit to 8 for featured section
        const approvedProperties = allProperties
          .filter((p: Property) => p) // Filter out any invalid properties
          .slice(0, 8); // Limit to 8 properties

        // Map to FeaturedProperty format
        const mappedProperties: FeaturedProperty[] = approvedProperties.map((property, index) => ({
          id: property.id || `property-${index}-${Date.now()}`,
          image: property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          title: property.name,
          location: `${property.location}, ${property.city}`,
          price: `Rs. ${property.price.toLocaleString('en-PK')}`,
          priceLabel: property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent',
          beds: property.bedrooms,
          baths: property.bathrooms,
          area: `${property.area} sq ft`,
          slug: property.slug,
        }));

        setFeaturedProperties(mappedProperties);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600">
            Discover the best properties for rent and sale
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="relative sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredProperties.map((property, index) => (
                  <CarouselItem
                    key={property.slug || property.id || `property-${index}`}
                    className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3"
                  >
                    <PropertyCard property={property} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;