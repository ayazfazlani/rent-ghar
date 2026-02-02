 'use client'
import { useState, useEffect } from 'react';
import { Search, ArrowUp, Home, MapPin, ChevronRight } from 'lucide-react';

const AnimatedCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / docHeight) * 100;
      
      setScrollProgress(progress);
      
      // Show bar when user scrolls down 300px
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Professional Black & White CTA Bar - Only shows when scrolling */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">

        {/* Subtle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gray-800">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Main Bar with Glass Morphism */}
        <div className="relative backdrop-blur-xl bg-black/95 border-t border-white/10">
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-subtle-shift"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left Side - Minimal Professional Text */}
              <div className="flex items-center gap-4 md:gap-6">
                
                {/* Elegant Icon Badge */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 hover:bg-white/10 p-2.5 md:p-3 rounded-full border border-white/10 transition-all duration-300 group-hover:scale-110">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                {/* Professional Text Content */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-subtle"></span>
                      <span className="text-white text-xs font-semibold uppercase tracking-wider">Available Now</span>
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base">
                      Premium Properties in Pakistan
                    </h3>
                  </div>
                  <p className="hidden md:block text-gray-400 text-xs md:text-sm">
                    <span className="text-white font-semibold">500+</span> Verified Listings • 
                    <span className="text-gray-300 font-medium ml-1">Prime Locations</span> • 
                    <span className="text-gray-300 font-medium ml-1">Best Value</span>
                  </p>
                  <p className="md:hidden text-gray-400 text-xs">
                    <span className="text-white font-semibold">500+</span> Premium Properties
                  </p>
                </div>

                {/* Stats - Desktop Only */}
                <div className="hidden lg:flex items-center gap-5 ml-6 pl-6 border-l border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">500+</p>
                      <p className="text-gray-400 text-[10px]">Properties</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-white/10"></div>
                  
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">50+</p>
                      <p className="text-gray-400 text-[10px]">Locations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Premium CTA Button */}
              <div className="flex items-center gap-3">
                
                {/* Desktop: Elegant Premium Button */}
                <button
                  onClick={scrollToHero}
                  className="hidden md:flex group relative items-center gap-3 px-7 py-3.5 bg-white hover:bg-gray-100 text-black rounded-full font-bold text-sm transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-3">
                    <div className="bg-black/5 group-hover:bg-black/10 p-1.5 rounded-lg transition-colors duration-300">
                      <Search className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-bold">
                      Find Your Property
                    </span>
                    <div className="bg-black p-1.5 rounded-lg group-hover:scale-110 transition-all duration-300">
                      <ArrowUp className="w-3.5 h-3.5 text-white group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Elegant corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-black/5 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 bg-black/5 rounded-tr-2xl"></div>
                </button>

                {/* Mobile: Clean Compact Button */}
                <button
                  onClick={scrollToHero}
                  className="md:hidden group relative flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-full font-bold text-xs transition-all duration-500 hover:scale-105 shadow-lg overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <Search className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Search Now</span>
                  <ArrowUp className="w-3 h-3 relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Minimal bottom line */}
          <div className="h-px bg-white/20"></div>
        </div>
        </div>
      )}

      {/* Elegant CSS Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes subtle-shift {
          0%, 100% {
            transform: translateX(-50%);
            opacity: 0.05;
          }
          50% {
            transform: translateX(50%);
            opacity: 0.1;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-subtle-shift {
          animation: subtle-shift 8s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AnimatedCTABar;