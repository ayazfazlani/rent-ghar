 'use client'
import React from 'react';
import { Handshake, FileCheck, TrendingUp, Truck } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    {
      id: 1,
      title: "Ownership",
      icon: Handshake,
      position: "right",
      description: "IMARAT, a real estate company, prioritizes verifying proper land acquisition to mitigate legal concerns. Through rigorous due diligence, they ensure industry-leading compliance"
    },
    {
      id: 2,
      title: "Approvals",
      icon: FileCheck,
      position: "left",
      description: "IMARAT emphasizes obtaining necessary approvals to address legal considerations in real estate transactions. Their meticulous due diligence and compliance guarantee secure properties for clients"
    },
    {
      id: 3,
      title: "Demand",
      icon: TrendingUp,
      position: "right",
      description: "We excel in commercial projects by hosting a diverse range of brands for Pakistan's growing population. Through market analysis and expertise in real estate development, we create iconic destinations"
    },
    {
      id: 4,
      title: "Delivery",
      icon: Truck,
      position: "left",
      description: "Our commitment to timely delivery ensures that projects are completed on schedule. We maintain high standards of quality while meeting deadlines and exceeding client expectations"
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
      
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative pt-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 animate-fade-in">
            About <span className="text-gray-600">RentGhar</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your trusted platform for finding the perfect property in Pakistan
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Discover thousands of properties for rent and sale across Multan, Lahore, 
            Karachi, Rawalpindi and Islamabad. We're committed to making property 
            transactions transparent, secure, and hassle-free.
          </p>
        </div>
      </div>

      {/* Process Sections with Connected Nodes */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-4">
        <div className="relative max-w-6xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isLeft = section.position === "left";
            const isLast = index === sections.length - 1;

            return (
              <div 
                key={section.id} 
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                  isLast ? 'mb-0' : 'mb-32 md:mb-40'
                } ${isLeft ? 'md:flex-row-reverse' : ''} opacity-0 animate-slide-up`}
                style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
              >
                {/* Content */}
                <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'} text-center transition-all duration-500 hover:scale-105`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {section.description}
                  </p>
                </div>

                {/* Node with Connection - Desktop Only */}
                <div className="relative flex-shrink-0 z-10">
                  {/* Connecting Line */}
                  {!isLast && (
                    <svg 
                      className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full"
                      width="4" 
                      height="200"
                    >
                      <line
                        x1="2"
                        y1="0"
                        x2="2"
                        y2="200"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-gray-300"
                      />
                    </svg>
                  )}

                  {/* Main Circle */}
                  <div className="relative w-36 h-36 md:w-40 md:h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-6 border-4 border-gray-400">
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center transition-all duration-500">
                      <Icon className="w-14 h-14 md:w-16 md:h-16 text-gray-800 transition-all duration-500 group-hover:scale-110" />
                    </div>
                  </div>
                </div>

                {/* Empty space for layout */}
                <div className="hidden md:block w-5/12" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="transition-all duration-500 hover:scale-110">
              <div className="text-5xl font-bold text-gray-900 mb-2">5000+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="transition-all duration-500 hover:scale-110">
              <div className="text-5xl font-bold text-gray-900 mb-2">2000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="transition-all duration-500 hover:scale-110">
              <div className="text-5xl font-bold text-gray-900 mb-2">18+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}