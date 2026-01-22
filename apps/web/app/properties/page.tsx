 'use client'
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { propertyTypes } from '@/lib/data';
import { propertyApi } from '@/lib/api';
import cityApi from '@/lib/api/city/city.api';
import areaApi from '@/lib/api/area/area.api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';

interface City {
  _id: string;
  name: string;
  state: string;
  country: string;
}

interface Area {
  _id: string;
  name: string;
  city: string | City;
}

const Properties = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [purpose, setPurpose] = useState<'rent' | 'buy'>(
    (searchParams.get('purpose') as 'rent' | 'buy') || 'rent'
  );
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [cityId, setCityId] = useState<string | null>(searchParams.get('cityId') || null);
  const [areaId, setAreaId] = useState<string | null>(searchParams.get('areaId') || null);
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cities and Areas state
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const data = await cityApi.getAll();
        setCities(data);
        
        // If city name is in URL, find the city ID
        const cityParam = searchParams.get('city');
        if (cityParam && cityParam !== 'all') {
          const foundCity = data.find((c: any) => c.name.toLowerCase() === cityParam.toLowerCase());
          if (foundCity) {
            setCityId(foundCity._id);
          }
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [searchParams]);

  // Fetch areas when cityId changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!cityId) {
        setAreas([]);
        return;
      }

      try {
        setLoadingAreas(true);
        const data = await areaApi.getAll(cityId);
        setAreas(data);
      } catch (err) {
        console.error('Error fetching areas:', err);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [cityId]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters: { cityId?: string; areaId?: string } = {};
        if (cityId) filters.cityId = cityId;
        if (areaId) filters.areaId = areaId;
        
        const data = await propertyApi.getAll(filters);
        // Map backend properties to frontend format
        const mappedProperties = Array.isArray(data) 
          ? data.map(mapBackendToFrontendProperty)
          : [];
        setProperties(mappedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [cityId, areaId]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // ✅ 'all' ko handle kiya
      const matchesPurpose = purpose === 'all' || property.purpose === purpose;
      const matchesType = type === 'all' || property.type === type;
      // Area filtering is handled by API, so we don't need to filter by areaId here
      return matchesPurpose && matchesType;
    });
  }, [purpose, type, properties]);

  // Calculate property counts per area
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    properties.forEach(property => {
      if (property.areaId) {
        counts[property.areaId] = (counts[property.areaId] || 0) + 1;
      }
    });
    return counts;
  }, [properties]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    
    // If updating city, find city ID and clear area
    if (key === 'city') {
      if (value === 'all') {
        params.delete('cityId');
        params.delete('areaId');
        setCityId(null);
        setAreaId(null);
      } else {
        const foundCity = cities.find(c => c.name.toLowerCase() === value.toLowerCase());
        if (foundCity) {
          params.set('cityId', foundCity._id);
          params.delete('areaId');
          setCityId(foundCity._id);
          setAreaId(null);
        }
      }
    }
    
    router.push(`/properties?${params.toString()}`);
  };

  const handleAreaClick = (areaIdToFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('areaId', areaIdToFilter);
    setAreaId(areaIdToFilter);
    router.push(`/properties?${params.toString()}`);
  };

  const clearAreaFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('areaId');
    setAreaId(null);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner with fade-in animation */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12 bg-secondary animate-in fade-in duration-500">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-in slide-in-from-bottom-4 duration-700">
            Properties in <span className="text-primary">{city}</span>
          </h1>
          <p className="text-muted-foreground animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Find your perfect property from our extensive listings
          </p>
        </div>
      </section>

      {/* Filters with slide-in animation */}
      <section className="py-6 border-b border-border bg-background sticky top-16 md:top-20 z-40 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Purpose Tabs */}
            <div className="flex gap-2 animate-in slide-in-from-left-4 duration-500">
              <button
                onClick={() => {
                  setPurpose('rent');
                  updateFilters('purpose', 'rent');
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  purpose === 'rent' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() => {
                  setPurpose('buy');
                  updateFilters('purpose', 'buy');
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  purpose === 'buy' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                For Sale
              </button>
            </div>

            <div className="flex-1" />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 animate-in slide-in-from-right-4 duration-500">
              <Select
                value={city}
                onValueChange={(value) => {
                  setCity(value);
                  updateFilters('city', value);
                }}
                disabled={loadingCities}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={loadingCities ? "Loading..." : "City"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c._id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value);
                  updateFilters('type', value);
                }}
              >
                <SelectTrigger className="w-[140px] transition-all duration-200 hover:border-primary">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid with staggered animation */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 animate-in slide-in-from-bottom-2 duration-500">
            <p className="text-muted-foreground">
              {loading ? (
                'Loading properties...'
              ) : error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
                </>
              )}
            </p>
            
            {/* Clear Filters Button */}
            {(purpose !== 'all' || city !== 'all' || type !== 'all' || areaId) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPurpose('all');
                  setCity('all');
                  setType('all');
                  setCityId(null);
                  setAreaId(null);
                  router.push('/properties');
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Areas Section - Show when city is selected */}
          {cityId && areas.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Areas in {cities.find(c => c._id === cityId)?.name}
                </h2>
                {areaId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAreaFilter}
                  >
                    Clear Area Filter
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {areas.map((area) => {
                  const count = areaCounts[area._id] || 0;
                  const isActive = areaId === area._id;
                  return (
                    <Button
                      key={area._id}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => handleAreaClick(area._id)}
                      className="flex items-center gap-2"
                    >
                      {area.name}
                      <Badge variant={isActive ? "secondary" : "outline"} className="ml-1">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error loading properties
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Retry
              </Button>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
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
                  setCityId(null);
                  setAreaId(null);
                  router.push('/properties');
                }}
                className="animate-in slide-in-from-bottom-2 duration-500 delay-400 transition-all hover:scale-105"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;