 'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities, propertyTypes } from '@/lib/data';

const HeroSection = () => {
  const router = useRouter();
  const [purpose, setPurpose] = useState<'rent' | 'buy'>('rent');
  const [city, setCity] = useState('Multan');
  const [type, setType] = useState('');

  const handleSearch = () => {
    router.push(`/properties?purpose=${purpose}&city=${city}${type ? `&type=${type}` : ''}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
          alt="Beautiful home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect <span className="text-primary">Home</span> in Pakistan
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Discover thousands of properties for rent and sale across Multan, Lahore, Karachi, and Islamabad
          </p>

          {/* Search Box */}
          <div className="bg-background rounded-2xl p-4 md:p-6 shadow-2xl max-w-3xl mx-auto">
            {/* Purpose Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPurpose('rent')}
                className={`filter-tab flex-1 ${purpose === 'rent' ? 'active' : ''}`}
              >
                Rent
              </button>
              <button
                onClick={() => setPurpose('buy')}
                className={`filter-tab flex-1 ${purpose === 'buy' ? 'active' : ''}`}
              >
                Buy
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
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

              <Button onClick={handleSearch} className="h-10 gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">5000+</p>
              <p className="text-white/70">Properties Listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">2000+</p>
              <p className="text-white/70">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">18+</p>
              <p className="text-white/70">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;