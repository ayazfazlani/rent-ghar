 'use client'
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { properties, cities, propertyTypes } from '@/lib/data';

const Properties = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [purpose, setPurpose] = useState<'rent' | 'buy'>(
    (searchParams.get('purpose') as 'rent' | 'buy') || 'rent'
  );
  const [city, setCity] = useState(searchParams.get('city') || 'Multan');
  const [type, setType] = useState(searchParams.get('type') || '');

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesPurpose = property.purpose === purpose;
      const matchesCity = property.city === city;
      const matchesType = !type || type === 'all' || property.type === type;
      return matchesPurpose && matchesCity && matchesType;
    });
  }, [purpose, city, type]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Properties in <span className="text-primary">{city}</span>
          </h1>
          <p className="text-muted-foreground">
            Find your perfect property from our extensive listings
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Purpose Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPurpose('rent');
                  updateFilters('purpose', 'rent');
                }}
                className={`filter-tab ${purpose === 'rent' ? 'active' : ''}`}
              >
                For Rent
              </button>
              <button
                onClick={() => {
                  setPurpose('buy');
                  updateFilters('purpose', 'buy');
                }}
                className={`filter-tab ${purpose === 'buy' ? 'active' : ''}`}
              >
                For Sale
              </button>
            </div>

            <div className="flex-1" />

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={city}
                onValueChange={(value) => {
                  setCity(value);
                  updateFilters('city', value);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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
                <SelectTrigger className="w-[140px]">
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

      {/* Properties Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to find more properties
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setType('');
                  router.push(`/properties?purpose=${purpose}&city=${city}`);
                }}
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