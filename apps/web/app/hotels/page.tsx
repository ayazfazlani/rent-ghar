 'use client'
import { useState, useMemo } from 'react';
import { Hotel as HotelIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import { hotels, cities } from '@/lib/data';

const Hotels = () => {
  const [city, setCity] = useState('');

  const filteredHotels = useMemo(() => {
    if (!city || city === 'all') return hotels;
    return hotels.filter((hotel) => hotel.city === city);
  }, [city]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Premium <span className="text-primary">Hotels</span>
          </h1>
          <p className="text-muted-foreground">
            Book the best hotels across Pakistan at competitive rates
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredHotels.length}</span> hotels available
            </p>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <HotelIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hotels found
              </h3>
              <p className="text-muted-foreground">
                No hotels available in this city at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;