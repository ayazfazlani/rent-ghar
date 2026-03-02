'use client'
/**
 * Shared Properties Listing Component
 * 
 * This component can be used with either:
 * - Query params: /properties?purpose=rent&city=karachi&type=house
 * - Direct props: purpose, city, type passed as props
 */

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { propertyApi, cityApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';
import { toast } from 'sonner';
import SearchSidebar from '@/components/SearchSidebar';
import LocationExplorer from '@/components/LocationExplorer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';


interface PropertiesListingProps {
  purpose: 'rent' | 'buy' | 'all';
  city?: string;
  type?: string;
  useCleanUrls?: boolean; // If true, navigate using /properties/rent/city/type format
  richDescription?: string;
  areaId?: string;
}

export default function PropertiesListing({
  purpose,
  city: initialCity = '',
  type: initialType = 'all',
  useCleanUrls = false,
  richDescription,
  areaId: initialAreaId
}: PropertiesListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // STATE: Properties and filters
  const [properties, setProperties] = useState<Property[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [city, setCity] = useState(initialCity);
  const [type, setType] = useState(initialType);
  // Local state for filters before applying
  const [tempCity, setTempCity] = useState(initialCity);
  const [tempType, setTempType] = useState(initialType);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);


  // State for advanced filters
  const [advancedFilters, setAdvancedFilters] = useState<{
    priceMin?: number;
    priceMax?: number;
    areaMin?: number;
    areaMax?: number;
    marlaMin?: number;
    marlaMax?: number;
    beds?: number;
    baths?: number;
  }>({});

  const handleFilterChange = (newFilters: any) => {
    setAdvancedFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };


  // Helper function to create slug from city name
  const cityToSlug = (cityName: string): string => {
    return cityName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper function to find city name from slug (handles both full slugs and abbreviations)
  const slugToCity = (slug: string, cityList: string[]): string | null => {
    const normalizedSlug = slug.toLowerCase().trim();

    // First try exact slug match
    const exactMatch = cityList.find(c => cityToSlug(c) === normalizedSlug);
    if (exactMatch) return exactMatch;

    // Try to match by first letters (e.g., "dgk" matches "Dera Ghazi Khan")
    const words = normalizedSlug.split('-');
    if (words.length > 0) {
      const firstLetters = words.map((w: string) => w[0] || '').join('');
      const abbreviationMatch = cityList.find(c => {
        const cityWords = c.toLowerCase().split(/\s+/);
        const cityAbbr = cityWords.map((w: string) => w[0] || '').join('');
        return cityAbbr === firstLetters;
      });
      if (abbreviationMatch) return abbreviationMatch;
    }

    // Try partial match (e.g., "dgk" might match cities starting with "dera")
    const partialMatch = cityList.find(c =>
      cityToSlug(c).startsWith(normalizedSlug) ||
      normalizedSlug.startsWith(cityToSlug(c).substring(0, 3))
    );
    if (partialMatch) return partialMatch;

    return null;
  };

  // Extract unique cities
  const cities = useMemo(() => {
    if (allCities && allCities.length > 0) {
      return allCities.map(c => c.name).sort();
    }
    const uniqueCities = Array.from(new Set(
      properties
        .map((p: Property) => p.city)
        .filter((c): c is string => typeof c === 'string' && c.length > 0)
    ));
    return uniqueCities.sort();
  }, [properties, allCities]);

  // Match city slug to actual city name (for display/filtering)
  const matchedCity = useMemo(() => {
    if (!city) return '';
    // If cities array is not loaded yet, return the city as-is (will be matched later)
    if (cities.length === 0) return city;
    // If city is already a valid city name, use it
    if (cities.includes(city)) return city;
    // Otherwise, try to match it as a slug
    const matched = slugToCity(city, cities);
    // Case-insensitive match against cities list
    const found = cities.find(c => c.toLowerCase() === city.toLowerCase());
    if (found) return found;
    // Otherwise, try to match it as a slug
    return slugToCity(city, cities) || city;
  }, [city, cities]);

  const propertyTypes = useMemo(() => {
    if (allPropertyTypes && allPropertyTypes.length > 0) {
      return allPropertyTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).sort();
    }
    const validTypes: Property['type'][] = ['House', 'Apartment', 'Flat', 'Commercial'];
    const uniqueTypes = Array.from(new Set(
      properties
        .map((p: Property) => p.type)
        .filter((t): t is Property['type'] => validTypes.includes(t))
    ));
    return uniqueTypes.sort();
  }, [properties, allPropertyTypes]);


  // FETCH PROPERTIES FROM API

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }
        setError(null);

        const [citiesResponse, typesResponse] = await Promise.all([
          cityApi.getAll(),
          propertyApi.getTypes()
        ]);
        setAllCities(citiesResponse);
        setAllPropertyTypes(typesResponse);

        // Fetch properties with filters and pagination
        const cityToMatch = matchedCity || city;
        const currentCity = citiesResponse.find((c: any) => c.name.toLowerCase() === cityToMatch.toLowerCase());

        const response = await propertyApi.getAll({
          cityId: currentCity?._id,
          cityName: cityToMatch,
          areaId: searchParams.get('areaId') || initialAreaId || undefined,
          search: searchParams.get('search') || undefined,

          priceMin: advancedFilters.priceMin,
          priceMax: advancedFilters.priceMax,
          areaMin: advancedFilters.areaMin,
          areaMax: advancedFilters.areaMax,
          marlaMin: advancedFilters.marlaMin,
          marlaMax: advancedFilters.marlaMax,
          beds: advancedFilters.beds,
          baths: advancedFilters.baths,
          type: type !== 'all' ? type : undefined,
          purpose: purpose !== 'all' ? purpose : undefined,
          page: currentPage,
          limit: 12
        });



        // Handle both pagination object and direct array response
        let backendProperties: BackendProperty[] = [];
        let total = 0;
        let pages = 1;

        if (Array.isArray(response)) {
          backendProperties = response;
          total = response.length;
          pages = 1;
        } else if (response && response.properties) {
          backendProperties = response.properties;
          total = response.total || 0;
          pages = response.totalPages || 1;
        } else {
          console.error('Unexpected API response format:', response);
          backendProperties = [];
        }

        const transformedProperties = backendProperties.map(mapBackendToFrontendProperty);


        if (currentPage === 1) {
          setProperties(transformedProperties);
        } else {
          setProperties(prev => [...prev, ...transformedProperties]);
        }

        setTotalPages(pages);

      } catch (err: any) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
        setError(errorMessage);
        toast.error('Error', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchData();
  }, [matchedCity, purpose, type, advancedFilters, searchParams, currentPage, initialAreaId]);

  // Derive richDescription from allCities based on purpose if not explicitly provided
  const effectiveRichDescription = useMemo(() => {
    if (richDescription) return richDescription;

    // Only attempt to derive if we have a city matched
    if (!matchedCity || allCities.length === 0) return undefined;

    const cityData = allCities.find(c => c.name.toLowerCase() === matchedCity.toLowerCase());
    if (!cityData) return undefined;

    if (purpose === 'rent') return cityData.rentContent;
    if (purpose === 'buy') return cityData.saleContent;

    return cityData.description;
  }, [richDescription, matchedCity, allCities, purpose]);


  // Update state when props change
  useEffect(() => {
    setProperties([]); // Clear old results to prevent stale display during loading
    setCity(initialCity);
    setType(initialType);
    setTempCity(initialCity);
    setTempType(initialType);
    setCurrentPage(1); // Reset to first page on URL/filter change
  }, [initialCity, initialType, purpose, searchParams, initialAreaId]);


  // Match temp city for the filter dropdown
  const matchedTempCity = useMemo(() => {
    if (!tempCity) return '';
    // If tempCity is already a valid city name, use it
    if (cities.includes(tempCity)) return tempCity;
    // Otherwise, try to match it as a slug
    return slugToCity(tempCity, cities) || tempCity;
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
  const filteredProperties = properties;


  const currentAreaId = useMemo(() => {
    // If we're filtering by areaId, pass it to explorer
    return searchParams.get('areaId') || initialAreaId || '';
  }, [searchParams, initialAreaId]);

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
  if (error && properties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Error Loading Properties</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => setCurrentPage(1)}>Retry</Button>
        </div>

      </div>
    );
  }

  const updateFilters = (newCity: string, newType: string, newPurpose?: 'rent' | 'buy' | 'all', forceCleanUrl = false) => {
    const currentPurpose = newPurpose || purpose;

    // Always use clean URLs when forceCleanUrl is true (from Apply button) or when useCleanUrls is true
    const shouldUseCleanUrl = (forceCleanUrl || useCleanUrls);

    // Get existing parameters to preserve
    const params = new URLSearchParams(searchParams.toString());

    // City and Type are now handled by path in clean URLs, so remove them from query if present
    if (shouldUseCleanUrl) {
      params.delete('city');
      params.delete('type');
      params.delete('purpose');

      // Use 'sale' for path if purpose is 'buy'
      const purposePath = currentPurpose === 'buy' ? 'sale' : currentPurpose;
      const citySlug = newCity ? cityToSlug(newCity) : '';
      const typeSlug = newType && newType !== 'all'
        ? `/${newType.toLowerCase()}`
        : '';

      const queryString = params.toString();
      const suffix = queryString ? `?${queryString}` : '';

      if (citySlug) {
        router.push(`/properties/${purposePath}/${citySlug}${typeSlug}${suffix}`);
      } else {
        router.push(`/properties/${purposePath}${suffix}`);
      }
    } else {
      // Use query params format
      if (currentPurpose !== 'all') params.set('purpose', currentPurpose);
      else params.delete('purpose');

      if (newCity) params.set('city', newCity);
      else params.delete('city');

      if (newType && newType !== 'all') params.set('type', newType);
      else params.delete('type');

      const queryString = params.toString();
      router.push(queryString ? `/properties?${queryString}` : '/properties');
    }
  };



  return (
    <div className="min-h-screen bg-background">

      {/* Main Content Area - Sidebar + Grid */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar - Desktop Only */}
            <aside className="w-80 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <SearchSidebar
                  city={matchedCity}
                  purpose={purpose}
                  type={type}
                  useCleanUrls={useCleanUrls}
                  filters={advancedFilters}
                  onFilterChange={handleFilterChange}
                />

              </div>
            </aside>

            {/* Main Listing Side */}
            <div className="w-full lg:w-3/4 space-y-10">

              {/* Location Explorer Board */}
              <LocationExplorer
                city={matchedCity}
                purpose={purpose}
                currentAreaId={currentAreaId}
                currentType={type}

                onAreaSelect={(areaId, areaSlug) => {
                  // Standardize navigation to preserve current filters
                  const params = new URLSearchParams(searchParams.toString());
                  const isUnselecting = params.get('areaId') === areaId || initialAreaId === areaId;

                  if (useCleanUrls && matchedCity) {
                    const currentPurpose = purpose;
                    const purposePath = currentPurpose === 'buy' ? 'sale' : currentPurpose;
                    const citySlug = cityToSlug(matchedCity);

                    // If unselecting, go to city page
                    if (isUnselecting) {
                      router.push(`/properties/${purposePath}/${citySlug}`);
                      return;
                    }

                    // If selecting and we have a slug, go to area page
                    if (areaSlug) {
                      router.push(`/properties/${purposePath}/${citySlug}/${areaSlug}`);
                      return;
                    }
                  }

                  // Fallback to query params
                  if (isUnselecting) {
                    params.delete('areaId');
                  } else {
                    params.set('areaId', areaId);
                  }

                  // Use standardized updateFilters logic for navigation
                  const queryString = params.toString();
                  const currentPath = window.location.pathname;
                  // If we are on a clean URL for an area (e.g. /model-town) and we switch to another area via query param (fallback)
                  // We should probably redirect to base city URL + query param, but keeping current path might be okay if next.js handles it.
                  // But if next.js treats current path as [type], adding ?areaId might be confusing but valid.
                  // However, if we unselect, we want to clear the area. 
                  // If we are at /model-town and unselect, we want to go up to /multan.
                  // The useCleanUrls block above handles this for unselecting if we have city matched.

                  router.push(`${currentPath}${queryString ? `?${queryString}` : ''}`);
                }}
                onTypeSelect={(newType) => {
                  // When selecting from summary (city-wide context), clear areaId
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('areaId');

                  const currentPurpose = purpose;
                  const shouldUseCleanUrl = useCleanUrls; // Allow clean URLs for all purposes including 'all'

                  if (shouldUseCleanUrl) {
                    const purposePath = currentPurpose === 'buy' ? 'sale' : currentPurpose;
                    const citySlug = cityToSlug(matchedCity);
                    const typeSlug = newType && newType !== 'all' ? `/${newType.toLowerCase()}` : '';

                    params.delete('city');
                    params.delete('type');
                    params.delete('purpose');

                    const queryString = params.toString();
                    const suffix = queryString ? `?${queryString}` : '';
                    router.push(`/properties/${purposePath}/${citySlug}${typeSlug}${suffix}`);
                  } else {
                    if (currentPurpose !== 'all') params.set('purpose', currentPurpose);
                    if (matchedCity) params.set('city', matchedCity);
                    if (newType && newType !== 'all') params.set('type', newType);
                    else params.delete('type');

                    const queryString = params.toString();
                    router.push(queryString ? `/properties?${queryString}` : '/properties');
                  }
                }}
                onPurposeChange={(newPurpose) => {
                  // Switch between rent and buy while keeping city and type
                  updateFilters(matchedCity, type, newPurpose);
                }}
              />



              {/* Properties Grid */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    Property Listings
                  </h3>

                  {/* Mobile Filters Trigger - Hide if FilterBar is enough, or keep as advanced */}
                  <div className="lg:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-full border-gray-300">
                          <Filter className="w-4 h-4" />
                          Advanced Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                        <SheetHeader className="p-4 border-b text-left">
                          <SheetTitle>Search Filters</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 overflow-y-auto h-[calc(100vh-100px)]">
                          <SearchSidebar
                            city={matchedCity}
                            purpose={purpose}
                            type={type}
                            useCleanUrls={useCleanUrls}
                            filters={advancedFilters}
                            onFilterChange={(newFilters) => {
                              handleFilterChange(newFilters);
                            }}
                          />

                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {filteredProperties.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {currentPage < totalPages && (
                      <div className="flex justify-center pt-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={isFetchingMore}
                          className="min-w-[200px] rounded-full border-primary text-primary hover:bg-primary/5"
                        >
                          {isFetchingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            'Load More Properties'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500 bg-secondary/30 rounded-xl">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 animate-in spin-in-180 duration-700">
                      <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                      No properties found
                    </h3>
                    <p className="text-muted-foreground mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                      Try adjusting your filters to find more properties
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setType('all');
                          updateFilters('', 'all');
                          setAdvancedFilters({});
                        }}
                        className="animate-in slide-in-from-bottom-2 duration-500 delay-400 transition-all hover:scale-105"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          {/* Hero Banner - Responsive sizing */}
          <section className="pt-24 pb-6 md:pt-28 md:pb-8 bg-secondary/50 animate-in fade-in duration-500">
            <div className="container mx-auto px-4">
              <p className="text-[10px] md:text-sm font-bold text-primary mb-1 uppercase tracking-widest opacity-70">
                Property Search
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                {type !== 'all' ? `${type.charAt(0).toUpperCase() + type.slice(1)}s` : 'Properties'}
                {purpose === 'rent' ? ' for Rent ' : purpose === 'buy' ? ' for Sale ' : ' '}
                in {matchedCity || 'Pakistan'}
              </h1>
              {effectiveRichDescription && (
                <div
                  className="mt-6 prose prose-sm max-w-4xl text-muted-foreground prose-headings:text-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: effectiveRichDescription }}
                />
              )}
            </div>
          </section>
        </div>
      </section>

    </div>
  );
}

