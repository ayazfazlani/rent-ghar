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
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
          alt="Beautiful home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Animated Floating Orbs - Hidden on Mobile */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Heading - Mobile Optimized */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            <span className="inline-block animate-in fade-in slide-in-from-bottom-6 duration-700">
              Find Your Perfect{' '}
            </span>
            <span className="inline-block animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <span className="text-primary bg-primary/10 px-3 md:px-4 py-1 md:py-2 rounded-xl   shadow-xl shadow-primary/20 inline-block">
                Home
              </span>
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              in Pakistan
            </span>
          </h1>

          {/* Subtitle - Mobile Optimized */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 leading-relaxed px-4">
            Discover thousands of properties for rent and sale across Multan, Lahore, Karachi, and Islamabad
          </p>

          {/* Search Box - Fully Mobile Optimized */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl max-w-3xl mx-auto border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 relative overflow-hidden group">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            <div className="relative z-10">
              {/* Purpose Tabs - Mobile Optimized */}
              <div className="flex gap-2 mb-4 md:mb-6">
                <button
                  onClick={() => setPurpose('rent')}
                  className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden ${
                    purpose === 'rent'
                      ? 'bg-black text-white shadow-lg shadow-black/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="relative z-10">Rent</span>
                  {purpose === 'rent' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                </button>
                <button
                  onClick={() => setPurpose('buy')}
                  className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden ${
                    purpose === 'buy'
                      ? 'bg-black text-white shadow-lg shadow-black/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="relative z-10">Buy</span>
                  {purpose === 'buy' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                </button>
              </div>

              {/* Filters - Mobile Optimized Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-11 md:h-12 text-sm md:text-base transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary/20 bg-white">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem 
                        key={c} 
                        value={c}
                        className="transition-colors duration-200 hover:bg-primary/10"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-11 md:h-12 text-sm md:text-base transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary/20 bg-white">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="transition-colors duration-200 hover:bg-primary/10">
                      All Types
                    </SelectItem>
                    {propertyTypes.map((t) => (
                      <SelectItem 
                        key={t} 
                        value={t}
                        className="transition-colors duration-200 hover:bg-primary/10"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleSearch} 
                  className="h-11 md:h-12 text-sm md:text-base gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95 relative overflow-hidden group/btn sm:col-span-2 md:col-span-1 bg-black hover:bg-black/90"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:rotate-90" />
                  <span className="relative z-10 font-semibold">Search</span>
                  {/* Button Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats - Mobile Optimized */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-16 mt-8 md:mt-12 px-4">
            <div className="text-center group cursor-default animate-in fade-in zoom-in duration-700 delay-1000 min-w-[100px]">
              <div className="relative inline-block">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                  5000+
                </p>
                <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-white/70 text-xs md:text-sm lg:text-base transition-colors duration-300 group-hover:text-white">
                Properties Listed
              </p>
            </div>

            <div className="text-center group cursor-default animate-in fade-in zoom-in duration-700 delay-1150 min-w-[100px]">
              <div className="relative inline-block">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                  2000+
                </p>
                <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-white/70 text-xs md:text-sm lg:text-base transition-colors duration-300 group-hover:text-white">
                Happy Customers
              </p>
            </div>

            <div className="text-center group cursor-default animate-in fade-in zoom-in duration-700 delay-1300 min-w-[100px]">
              <div className="relative inline-block">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                  18+
                </p>
                <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-white/70 text-xs md:text-sm lg:text-base transition-colors duration-300 group-hover:text-white">
                Years Experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
          }
          50% { 
            transform: translateY(-40px) translateX(-10px); 
          }
          75% { 
            transform: translateY(-20px) translateX(10px); 
          }
        }

        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          25% { 
            transform: translateY(-30px) translateX(-15px); 
          }
          50% { 
            transform: translateY(-50px) translateX(10px); 
          }
          75% { 
            transform: translateY(-30px) translateX(-15px); 
          }
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          33% { 
            transform: translateY(-25px) translateX(15px) scale(1.05); 
          }
          66% { 
            transform: translateY(-45px) translateX(-15px) scale(0.95); 
          }
        }

        @keyframes slow-zoom {
          0%, 100% { 
            transform: scale(1.05); 
          }
          50% { 
            transform: scale(1.1); 
          }
        }

        @keyframes shimmer {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(200%); 
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }

        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;