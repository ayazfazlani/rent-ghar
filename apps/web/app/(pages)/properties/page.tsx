 'use client'
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
//import Navbar from '@/components/NavBar';
//import Footer from '@/components/Footer';
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

  // Update state when URL parameters change
  useEffect(() => {
    const urlPurpose = searchParams.get('purpose') as 'rent' | 'buy';
    const urlCity = searchParams.get('city');
    const urlType = searchParams.get('type');
    
    if (urlPurpose) setPurpose(urlPurpose);
    if (urlCity) setCity(urlCity);
    if (urlType) setType(urlType);
  }, [searchParams]);

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

      {/* Enhanced Filters Section with Hero Section Style */}
      <section className="py-6 border-b border-border bg-white sticky top-16 md:top-20 z-40 shadow-md transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto">
            {/* Purpose Tabs - Left Side */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg animate-in slide-in-from-left-4 duration-500">
              <button
                onClick={() => {
                  setPurpose('rent');
                  updateFilters('purpose', 'rent');
                }}
                className={`relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                  purpose === 'rent'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">For Rent</span>
                {/* Lightning Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
              <button
                onClick={() => {
                  setPurpose('buy');
                  updateFilters('purpose', 'buy');
                }}
                className={`relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                  purpose === 'buy'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">For Sale</span>
                {/* Lightning Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
            </div>

            {/* Filter Dropdowns - Right Side */}
            <div className="flex flex-1 flex-wrap gap-3 justify-end w-full md:w-auto animate-in slide-in-from-right-4 duration-500 delay-100">
              {/* City Filter */}
              <div className="relative w-full sm:w-auto sm:min-w-[160px]">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    updateFilters('city', e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                >
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
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    updateFilters('type', e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-sm font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
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
                onClick={() => {
                  // Already updating on change, but this button provides visual feedback
                  const params = new URLSearchParams();
                  params.set('purpose', purpose);
                  params.set('city', city);
                  params.set('type', type);
                  router.push(`/properties?${params.toString()}`);
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Apply Filters
                </span>
                {/* Enhanced Lightning Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-white/20"></div>
              </button>
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

     </div>
  );
};

export default Properties;