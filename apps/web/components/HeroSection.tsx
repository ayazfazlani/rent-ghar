 'use client'
import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { properties } from '@/lib/data';

const HeroSection = () => {
  const router = useRouter();
  const [purpose, setPurpose] = useState<'rent' | 'buy'>('rent');
  const [city, setCity] = useState('Multan');
  const [type, setType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof properties>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const cities = ['Multan', 'Lahore', 'Karachi', 'Islamabad'];
  const propertyTypes = ['House', 'Apartment', 'Plot', 'Commercial', 'Farmhouse', 'Guest House'];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = properties.filter(property => 
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('purpose', purpose);
    params.append('city', city);
    if (type) {
      params.append('type', type);
    } else {
      params.append('type', 'all');
    }
    
    router.push(`/properties?${params.toString()}`);
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Enhanced Geometric Cut Pattern Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Diagonal Cuts - More Prominent */}
        <div className="absolute top-0 right-0 w-2/5 h-2/5 bg-black transform rotate-12 origin-top-right opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-black transform -rotate-12 origin-bottom-left opacity-10"></div>
        
        {/* Medium Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 border-8 border-black/10 transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 border-8 border-black/10 transform -rotate-12"></div>
        <div className="absolute top-2/3 left-1/3 w-32 h-32 bg-black/10 transform rotate-45"></div>
        
        {/* Animated Lines - More Visible */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/15 to-transparent"></div>
        <div className="absolute top-2/3 right-0 w-2/3 h-1 bg-gradient-to-l from-transparent via-black/15 to-transparent"></div>
        
        {/* Small Scattered Squares */}
        <div className="absolute top-1/5 right-1/3 w-12 h-12 bg-black/10 transform rotate-12 animate-float"></div>
        <div className="absolute bottom-1/5 left-1/5 w-16 h-16 bg-black/10 transform -rotate-12 animate-float-delayed"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 leading-tight text-black mt-8 md:mt-12">
          Find Your Perfect{' '}
          <span className="relative inline-block">
            Home
            <div className="absolute bottom-1 left-0 w-full h-3 bg-black/15 -z-10 animate-pulse"></div>
          </span>
          {' '}in Pakistan
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          Discover thousands of properties for rent and sale across major cities
        </p>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="relative bg-white rounded-xl shadow-xl border-2 border-black/10 p-6 hover:shadow-2xl transition-shadow duration-300">
            {/* Autocomplete Search Bar - Moved to top */}
            <div ref={searchRef} className="relative mb-4 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  placeholder="Search properties..."
                  className="w-full px-3 py-2 pl-9 pr-9 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-xs font-medium hover:border-gray-500 hover:shadow-md"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                  {filteredSuggestions.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => handlePropertyClick(property.id)}
                      className="w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-colors">
                          <Home className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 mb-0.5 truncate group-hover:text-black transition-colors">
                            {property.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {property.location}, {property.city}
                            </span>
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">
                              {property.type}
                            </span>
                          </div>
                          <div className="text-[10px] font-semibold text-gray-700 mt-0.5">
                            PKR {property.price.toLocaleString()}
                            {property.purpose === 'rent' ? '/month' : ''}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center z-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-0.5 font-medium">No properties found</p>
                  <p className="text-[10px] text-gray-500">Try searching with different keywords</p>
                </div>
              )}
            </div>

            {/* Purpose Tabs - Enhanced Lightning Effect */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg max-w-xs mx-auto">
              <button
                onClick={() => setPurpose('rent')}
                className={`relative flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 overflow-hidden group ${
                  purpose === 'rent'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">Rent</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
              <button
                onClick={() => setPurpose('buy')}
                className={`relative flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 overflow-hidden group ${
                  purpose === 'buy'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="relative z-10">Buy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700"></div>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 max-w-2xl mx-auto">
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-xs font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-white text-xs font-medium hover:border-gray-500 hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="relative bg-black text-white px-4 py-2 rounded-lg font-semibold text-xs transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-2xl overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-white/20"></div>
              </button>
            </div>
          </div>
        </div>
       </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-12deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;