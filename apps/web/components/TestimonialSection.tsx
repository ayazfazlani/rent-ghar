 "use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, User } from 'lucide-react';

interface Testimonial {
  id: number;
  title: string;
  text: string;
  name: string;
  role: string;
  rating: number;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
  heading?: string;
  subheading?: string;
  description?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    title: "It was the first time I ever sold a property",
    text: "Working with Rent Ghar was an absolute pleasure. Their professional team guided me through every step of the selling process. The attention to detail and commitment to finding the right buyer exceeded my expectations. I couldn't have asked for a better experience.",
    name: "Ayesha Khan",
    role: "Marketing Specialist",
    rating: 5
  },
  {
    id: 2,
    title: "Thank you very much for selling our apartment",
    text: "The entire process was seamless from start to finish. The team at Rent Ghar demonstrated exceptional professionalism and market knowledge. They sold our apartment quickly and at a great price. I highly recommend their services to anyone looking to buy or sell property.",
    name: "Ahmad Raees",
    role: "Office Assistant",
    rating: 5
  },
  {
    id: 3,
    title: "Outstanding service and excellent results",
    text: "Rent Ghar helped us find our dream home in Multan. Their expertise in the local market and dedication to understanding our needs made all the difference. The team was always available to answer questions and provided valuable insights throughout our search.",
    name: "Ismail Butt",
    role: "Business Owner",
    rating: 5
  },
  {
    id: 4,
    title: "Professional and reliable property consultants",
    text: "I've worked with several real estate agencies, but Rent Ghar stands out for their integrity and results-driven approach. They understood exactly what I was looking for and delivered beyond expectations. A truly trustworthy partner in real estate.",
    name: "Humna Khan",
    role: "Real Estate Investor",
    rating: 5
  }
];

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ 
  testimonials = defaultTestimonials,
  heading = "Testimonials",
  subheading = "What Our Clients Say",
  description = "See what our satisfied clients have to say about their experience with Rent Ghar."
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    
    const visible = [];
    const itemsToShow = Math.min(2, testimonials.length);
    
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 px-4 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto">
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
        {/* Header Section */}
        <div className="mb-10 lg:mb-12" style={{ animation: 'slideInLeft 0.8s ease-out' }}>
          <p className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">
            {subheading}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 hover:text-gray-700 transition-colors duration-300">
                {heading}
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-xl">
                {description}
              </p>
            </div>
            
            {/* Navigation Buttons - Desktop */}
            {testimonials.length > 2 && (
              <div className="hidden sm:flex gap-2 flex-shrink-0">
                <button
                  onClick={prevTestimonial}
                  className="w-11 h-11 rounded-lg border border-gray-300 hover:border-black hover:bg-black hover:text-white hover:scale-110 hover:rotate-12 transition-all duration-300 flex items-center justify-center text-black active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-11 h-11 rounded-lg bg-black hover:bg-gray-800 hover:scale-110 hover:-rotate-12 transition-all duration-300 flex items-center justify-center text-white active:scale-95"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {getVisibleTestimonials().map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-black mb-3 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                {testimonial.title}
              </h3>

              {/* Rating Stars */}
              <div className="flex gap-0.5 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={16}
                    className={`${
                      starIndex < testimonial.rating 
                        ? 'fill-black stroke-black group-hover:scale-110' 
                        : 'fill-gray-200 stroke-gray-200'
                    } transition-all duration-300`}
                    style={{
                      transitionDelay: `${starIndex * 50}ms`
                    }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm group-hover:text-gray-700 transition-colors duration-300">
                {testimonial.text}
              </p>

              {/* Author Information */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  {/* Avatar with Initials */}
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:bg-gray-800 transition-all duration-300">
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-sm group-hover:translate-x-1 transition-transform duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-xs group-hover:translate-x-1 transition-transform duration-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Quote Icon */}
                <Quote 
                  className="text-gray-300 flex-shrink-0 group-hover:text-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" 
                  size={36} 
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Navigation Buttons - Mobile */}
        {testimonials.length > 2 && (
          <div className="flex sm:hidden justify-center gap-2 mt-6">
            <button
              onClick={prevTestimonial}
              className="w-11 h-11 rounded-lg border border-gray-300 hover:border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center text-black active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-11 h-11 rounded-lg bg-black hover:bg-gray-800 hover:scale-110 transition-all duration-300 flex items-center justify-center text-white active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {testimonials.length > 2 && (
          <div className="flex justify-center gap-1.5 mt-6" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentIndex 
                    ? 'w-6 bg-black' 
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;