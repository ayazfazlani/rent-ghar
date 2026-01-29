'use client'
/**
 * Shared Properties Listing Component
 * 
 * This component can be used with either:
 * - Query params: /properties?purpose=rent&city=karachi&type=house
 * - Direct props: purpose, city, type passed as props
 */

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';
import { toast } from 'sonner';

interface PropertiesListingProps {
  purpose: 'rent' | 'buy' | 'all';
  city?: string;
  type?: string;
  useCleanUrls?: boolean; // If true, navigate using /properties/rent/city/type format
}

export default function PropertiesListing({ 
  purpose, 
  city: initialCity = '', 
  type: initialType = 'all',
  useCleanUrls = false 
}: PropertiesListingProps) {
  const router = useRouter();
  
  // STATE: Properties and filters
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [city, setCity] = useState(initialCity);
  const [type, setType] = useState(initialType);
  // Local state for filters before applying
  const [tempCity, setTempCity] = useState(initialCity);
  const [tempType, setTempType] = useState(initialType);

  // FETCH PROPERTIES FROM API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all approved properties from API
        const response = await propertyApi.getAll();
        const backendProperties = response as BackendProperty[];
        // Transform backend format to frontend format
        const transformedProperties = backendProperties.map(mapBackendToFrontendProperty);
        
        setProperties(transformedProperties);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load properties';
        setError(errorMessage);
        toast.error('Error', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Fetch once on mount

  // Update state when props change
  useEffect(() => {
    setCity(initialCity);
    setType(initialType);
    setTempCity(initialCity);
    setTempType(initialType);
  }, [initialCity, initialType, purpose]);

  // Extract unique cities and property types from fetched properties
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(properties.map((p: Property) => p.city).filter(Boolean))) as string[];
    return uniqueCities.sort();
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(properties.map((p: Property) => p.type).filter(Boolean))) as string[];
    return uniqueTypes.sort();
  }, [properties]);

  // Helper function to create slug from city name
  const cityToSlug = (cityName: string): string => {
    return cityName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper function to find city name from slug (handles both full slugs and abbreviations)
  const slugToCity = (slug: string): string | null => {
    const normalizedSlug = slug.toLowerCase().trim();
    
    // First try exact slug match
    const exactMatch = cities.find(c => cityToSlug(c) === normalizedSlug);
    if (exactMatch) return exactMatch;
    
    // Try to match by first letters (e.g., "dgk" matches "Dera Ghazi Khan")
    const words = normalizedSlug.split('-');
    if (words.length > 0) {
      const firstLetters = words.map(w => w[0] || '').join('');
      const abbreviationMatch = cities.find(c => {
        const cityWords = c.toLowerCase().split(/\s+/);
        const cityAbbr = cityWords.map(w => w[0] || '').join('');
        return cityAbbr === firstLetters;
      });
      if (abbreviationMatch) return abbreviationMatch;
    }
    
    // Try partial match (e.g., "dgk" might match cities starting with "dera")
    const partialMatch = cities.find(c => 
      cityToSlug(c).startsWith(normalizedSlug) || 
      normalizedSlug.startsWith(cityToSlug(c).substring(0, 3))
    );
    if (partialMatch) return partialMatch;
    
    return null;
  };

  // Match city slug to actual city name (for display/filtering)
  const matchedCity = useMemo(() => {
    if (!city) return '';
    // If cities array is not loaded yet, return the city as-is (will be matched later)
    if (cities.length === 0) return city;
    // If city is already a valid city name, use it
    if (cities.includes(city)) return city;
    // Otherwise, try to match it as a slug
    const matched = slugToCity(city);
    if (matched) return matched;
    // If no match found, try case-insensitive match
    const caseInsensitiveMatch = cities.find(c => c.toLowerCase() === city.toLowerCase());
    return caseInsensitiveMatch || city;
  }, [city, cities]);

  // Match temp city for the filter dropdown
  const matchedTempCity = useMemo(() => {
    if (!tempCity) return '';
    // If tempCity is already a valid city name, use it
    if (cities.includes(tempCity)) return tempCity;
    // Otherwise, try to match it as a slug
    return slugToCity(tempCity) || tempCity;
  }, [tempCity, cities]);

  // Normalize type for matching (handle case differences)
  const normalizedType = useMemo(() => {
    if (!type || type === 'all') return null;
    // Convert to title case for matching (e.g., "house" -> "House", "flat" -> "Flat")
    const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    // Also handle common variations
    const typeMap: Record<string, string> = {
      'house': 'House',
      'apartment': 'Apartment',
      'flat': 'Flat',
      'commercial': 'Commercial',
    };
    return typeMap[type.toLowerCase()] || normalized;
  }, [type]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property: Property) => {
      const matchesPurpose = property.purpose === purpose || purpose === 'all';
      const matchesCity = !matchedCity || property.city === matchedCity;
      // Case-insensitive type matching
      const matchesType = !normalizedType || 
        property.type.toLowerCase() === normalizedType.toLowerCase();
      return matchesPurpose && matchesCity && matchesType;
    });
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development' && (matchedCity || normalizedType)) {
      console.log('[PropertiesListing] Filter debug:', {
        totalProperties: properties.length,
        filteredCount: filtered.length,
        filters: {
          purpose,
          city: matchedCity,
          type: normalizedType,
        },
        sampleProperty: properties[0] ? {
          purpose: properties[0].purpose,
          city: properties[0].city,
          type: properties[0].type,
        } : null,
      });
    }
    
    return filtered;
  }, [properties, purpose, matchedCity, normalizedType]);

  const updateFilters = (newCity: string, newType: string, newPurpose?: 'rent' | 'buy' | 'all', forceCleanUrl = false) => {
    const currentPurpose = newPurpose || purpose;
    
    // Always use clean URLs when forceCleanUrl is true (from Apply button) or when useCleanUrls is true
    const shouldUseCleanUrl = forceCleanUrl || useCleanUrls;
    
    if (shouldUseCleanUrl && currentPurpose !== 'all') {
      // Use clean URL format: /properties/rent/city/type
      const purposePath = currentPurpose; // rent or buy
      const citySlug = newCity ? cityToSlug(newCity) : '';
      // Convert type to lowercase for URL (e.g., "House" -> "house")
      const typeSlug = newType && newType !== 'all' 
        ? `/${newType.toLowerCase()}` 
        : '';
      
      if (citySlug) {
        router.push(`/properties/${purposePath}/${citySlug}${typeSlug}`);
      } else {
        router.push(`/properties/${purposePath}`);
      }
    } else {
      // Use query params format (for 'all' purpose or when not forcing clean URLs)
      const params = new URLSearchParams();
      if (currentPurpose !== 'all') params.set('purpose', currentPurpose);
      if (newCity) params.set('city', newCity);
      if (newType && newType !== 'all') params.set('type', newType);
      const queryString = params.toString();
      router.push(queryString ? `/properties?${queryString}` : '/properties');
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Error Loading Properties</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
       
      {/* Hero Banner with fade-in animation */}
      <section className="pt-8 pb-8 md:pt-12 md:pb-12 bg-secondary animate-in fade-in duration-500">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-in slide-in-from-bottom-4 duration-700">
            {purpose === 'rent' ? 'Properties for Rent' : purpose === 'buy' ? 'Properties for Sale' : 'Properties'} 
            {matchedCity ? ` in ${matchedCity}` : ''}
            {type && type !== 'all' ? ` - ${type}` : ''}
          </h1>
          <p className="text-muted-foreground animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Find your perfect property from our extensive listings
          </p>
        </div>
      </section>

      {/* Properties Grid with staggered animation */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 animate-in slide-in-from-bottom-2 duration-500">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => (
                <div
                  key={`${property.id}-${index}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 animate-in spin-in-180 duration-700">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                Try adjusting your filters to find more properties
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setType('all');
                  updateFilters('', 'all');
                }}
                className="animate-in slide-in-from-bottom-2 duration-500 delay-400 transition-all hover:scale-105"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

     </div>
  );
}

