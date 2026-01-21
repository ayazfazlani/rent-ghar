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
  const [type, setType] = useState(searchParams.get('type') || 'all');

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
              >
                <SelectTrigger className="w-[140px] transition-all duration-200 hover:border-primary">
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
              <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
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
                  router.push(`/properties?purpose=${purpose}&city=${city}&type=all`);
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