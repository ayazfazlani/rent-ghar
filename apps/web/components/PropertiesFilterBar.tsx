'use client'
/**
 * Properties Filter Bar Component
 * 
 * Persistent filter bar that appears in the properties layout.
 * Handles navigation to clean URL routes based on selected filters.
 */

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';

export default function PropertiesFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // STATE: Properties for filter options
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Extract current filters from URL
  const currentPurpose = useMemo(() => {
    // Check if we're on a clean URL route
    if (pathname.startsWith('/properties/rent')) return 'rent';
    if (pathname.startsWith('/properties/sale')) return 'sale';
    // Check query params
    return (searchParams.get('purpose') as 'rent' | 'sale' | 'all') || 'all';
  }, [pathname, searchParams]);
  
  const currentCity = useMemo(() => {
    // Extract from pathname if on clean URL
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && (pathParts[1] === 'rent' || pathParts[1] === 'sale')) {
      return pathParts[2]; // City slug
    }
    return searchParams.get('city') || '';
  }, [pathname, searchParams]);
  
  const currentType = useMemo(() => {
    // Extract from pathname if on clean URL
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 4 && (pathParts[1] === 'rent' || pathParts[1] === 'sale')) {
      return pathParts[3]; // Type
    }
    return searchParams.get('type') || 'all';
  }, [pathname, searchParams]);
  
  // Temporary filter state (before applying)
  const [tempPurpose, setTempPurpose] = useState<'rent' | 'sale' | 'all'>(currentPurpose);
  const [tempCity, setTempCity] = useState('');
  const [tempType, setTempType] = useState('all');
  
  // FETCH PROPERTIES FOR FILTER OPTIONS
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyApi.getAll();
        const backendProperties = response as BackendProperty[];
        const transformedProperties = backendProperties.map(mapBackendToFrontendProperty);
        setProperties(transformedProperties);
      } catch (err) {
        console.error('Error fetching properties for filters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  
  // Update temp state when URL changes
  useEffect(() => {
    setTempPurpose(currentPurpose);
    // Match city slug to actual city name for dropdown
    const matchedCity = currentCity ? slugToCity(currentCity) : null;
    setTempCity(matchedCity || currentCity || '');
    setTempType(currentType || 'all');
  }, [currentPurpose, currentCity, currentType]);
  
  // Extract unique cities and property types
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(properties.map((p: Property) => p.city).filter(Boolean))) as string[];
    return uniqueCities.sort();
  }, [properties]);
  
  const propertyTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(properties.map((p: Property) => p.type).filter(Boolean))) as string[];
    return uniqueTypes.sort();
  }, [properties]);
  
  // Helper functions for city slug conversion
  const cityToSlug = (cityName: string): string => {
    return cityName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const slugToCity = (slug: string): string | null => {
    if (!slug) return null;
    const normalizedSlug = slug.toLowerCase().trim();
    
    // Try exact slug match
    const exactMatch = cities.find(c => cityToSlug(c) === normalizedSlug);
    if (exactMatch) return exactMatch;
    
    // Try abbreviation match
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
    
    // Try partial match
    const partialMatch = cities.find(c => 
      cityToSlug(c).startsWith(normalizedSlug) || 
      normalizedSlug.startsWith(cityToSlug(c).substring(0, 3))
    );
    if (partialMatch) return partialMatch;
    
    return null;
  };
  
  // Navigate to clean URL based on filters
  const applyFilters = () => {
    const purpose = tempPurpose === 'all' ? 'rent' : tempPurpose; // Default to rent if all
    const citySlug = tempCity ? cityToSlug(tempCity) : '';
    const typeSlug = tempType && tempType !== 'all' ? `/${tempType.toLowerCase()}` : '';
    
    if (citySlug) {
      router.push(`/properties/${purpose}/${citySlug}${typeSlug}`);
    } else {
      router.push(`/properties/${purpose}`);
    }
  };
  
  // Navigate to purpose page
  const navigateToPurpose = (newPurpose: 'rent' | 'sale' | 'all') => {
    const purpose = newPurpose === 'all' ? 'rent' : newPurpose;
    const citySlug = tempCity ? cityToSlug(tempCity) : '';
    const typeSlug = tempType && tempType !== 'all' ? `/${tempType.toLowerCase()}` : '';
    
    if (citySlug) {
      router.push(`/properties/${purpose}/${citySlug}${typeSlug}`);
    } else {
      router.push(`/properties/${purpose}`);
    }
  };
  
  if (loading) {
    return null; // Don't show filter bar while loading
  }
  
  return (
    <section className="py-4 border-b border-border bg-white sticky top-16 md:top-20 z-40 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto">
          {/* Purpose Tabs - Left Side */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setTempPurpose('rent');
                navigateToPurpose('rent');
              }}
              className={`relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                tempPurpose === 'rent'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="relative z-10">For Rent</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
            </button>
            <button
              onClick={() => {
                setTempPurpose('sale');
                navigateToPurpose('sale');
              }}
              className={`relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                tempPurpose === 'sale'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="relative z-10">For Sale</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
            </button>
          </div>
          
          {/* Filter Dropdowns - Right Side */}
          <div className="flex flex-1 flex-wrap gap-3 justify-end w-full md:w-auto">
            {/* City Filter */}
            <div className="relative w-full sm:w-auto sm:min-w-[160px]">
              <select
                value={tempCity}
                onChange={(e) => setTempCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                title="Select City"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Type Filter */}
            <div className="relative w-full sm:w-auto sm:min-w-[160px]">
              <select
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                title="Select Property Type"
              >
                <option value="all">All Types</option>
                {propertyTypes.map((t: string) => (
                  <option key={t} value={t.toLowerCase()}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Apply Button */}
            <button
              className="relative bg-black text-white px-6 py-2.5 rounded-lg font-semibold text-sm transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl overflow-hidden group w-full sm:w-auto"
              onClick={applyFilters}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Apply Filters
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-white/20"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

