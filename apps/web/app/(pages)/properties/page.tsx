 'use client'
/**
 * Properties Page - Dynamic API Integration with Collapsible Filters
 */

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Search, Loader2, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';
import { toast } from 'sonner';

const Properties = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // STATE: Properties and filters
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  
  const [purpose, setPurpose] = useState<'rent' | 'buy'>(
    (searchParams.get('purpose') as 'rent' | 'buy') || 'rent'
  );
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');

  // FETCH PROPERTIES FROM API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await propertyApi.getAll();
        const backendProperties = response as BackendProperty[];
        const transformedProperties = backendProperties.map(mapBackendToFrontendProperty);
        
        setProperties(transformedProperties);
        
        if (!city && transformedProperties.length > 0) {
          const firstCity = transformedProperties[0]?.city;
          if (firstCity) {
            setCity(firstCity);
            updateFilters('city', firstCity);
          }
        }
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
  }, []);

  useEffect(() => {
    const urlPurpose = searchParams.get('purpose') as 'rent' | 'buy';
    const urlCity = searchParams.get('city');
    const urlType = searchParams.get('type');
    
    if (urlPurpose) setPurpose(urlPurpose);
    if (urlCity) setCity(urlCity);
    if (urlType) setType(urlType);
  }, [searchParams]);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(properties.map((p: Property) => p.city).filter(Boolean))) as string[];
    return uniqueCities.sort();
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(properties.map((p: Property) => p.type).filter(Boolean))) as string[];
    return uniqueTypes.sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
      const matchesPurpose = property.purpose === purpose;
      const matchesCity = !city || property.city === city;
      const matchesType = !type || type === 'all' || property.type === type;
      return matchesPurpose && matchesCity && matchesType;
    });
  }, [properties, purpose, city, type]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/properties?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    params.set('city', city);
    params.set('type', type);
    router.push(`/properties?${params.toString()}`);
    setShowFilters(false); // Close filters after applying
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Error Loading Properties</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
       
      {/* Hero Banner */}
      <section className="pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 md:pb-12 bg-secondary animate-in fade-in duration-500">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 animate-in slide-in-from-bottom-4 duration-700">
            Properties {city ? `in ${city}` : ''}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Find your perfect property from our extensive listings
          </p>
        </div>
      </section>

      {/* Filter Section - Desktop (Hidden on Mobile) */}
      <section className="hidden md:block py-4 border-b border-border bg-white sticky top-20 z-40 shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex gap-4 max-w-6xl mx-auto">
            {/* Purpose Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setPurpose('rent');
                  updateFilters('purpose', 'rent');
                }}
                className={`relative px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                  purpose === 'rent' ? 'bg-black text-white shadow-lg' : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">For Rent</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
              <button
                onClick={() => {
                  setPurpose('buy');
                  updateFilters('purpose', 'buy');
                }}
                className={`relative px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                  purpose === 'buy' ? 'bg-black text-white shadow-lg' : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">For Sale</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
            </div>

            {/* City Filter */}
            <div className="relative flex-1">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  updateFilters('city', e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Type Filter */}
            <div className="relative flex-1">
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  updateFilters('type', e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                {propertyTypes.map((t: string) => (
                  <option key={t} value={t}>{t}</option>
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
              className="relative bg-black text-white px-6 py-2.5 rounded-lg font-semibold text-sm transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl overflow-hidden group min-w-[140px]"
              onClick={handleApplyFilters}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Apply Filters
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Filter Button (Shown only on Mobile) */}
      <section className="md:hidden sticky top-14 z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setShowFilters(true)}
            className="w-full bg-black text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            Filters & Search
          </button>
        </div>
      </section>

      {/* Mobile Filter Modal/Drawer */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-4">
              {/* Purpose Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Purpose</label>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setPurpose('rent')}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 ${
                      purpose === 'rent' ? 'bg-black text-white shadow-lg' : 'bg-transparent text-gray-700'
                    }`}
                  >
                    For Rent
                  </button>
                  <button
                    onClick={() => setPurpose('buy')}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 ${
                      purpose === 'buy' ? 'bg-black text-white shadow-lg' : 'bg-transparent text-gray-700'
                    }`}
                  >
                    For Sale
                  </button>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Property Type</label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button (Sticky at bottom) */}
            <div className="sticky bottom-0 bg-white border-t border-border p-4">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-black text-white px-6 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6 animate-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm sm:text-base text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
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
            <div className="text-center py-12 sm:py-16 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 animate-in spin-in-180 duration-700">
                <SlidersHorizontal className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                No properties found
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                Try adjusting your filters to find more properties
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setType('all');
                  router.push(`/properties?purpose=${purpose}&city=${city}&type=all`);
                }}
                className="animate-in slide-in-from-bottom-2 duration-500 delay-400 transition-all hover:scale-105 text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;