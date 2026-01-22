 'use client'
import { useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/lib/data';
import { propertyApi } from '@/lib/api';
interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK');
  };

  // Temporary placeholder images
  const getPlaceholderImage = (type: string) => {
    const images: { [key: string]: string } = {
      'House': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
      'Apartment': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'Plot': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      'Farm House': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    };
    return images[type] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
  };

  const imageUrl = property.image || getPlaceholderImage(property.type);

  // Navigate to detail page
  const handleCardClick = () => {

      router.push(`/properties/${property.id}`);

  };

  // Prevent navigation when clicking the Contact button
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add your contact logic here
    alert(`Contact for ${property.name}`);
  };

  return (
    <div 
      className="property-card group cursor-pointer bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 active:scale-[0.98]"
      onClick={handleCardClick}
    >
      {/* Image Container with Enhanced Animations */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-secondary to-secondary/50">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
          }}
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Purpose Badge with Animation */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40 animate-in fade-in slide-in-from-left duration-500">
            {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        
        {/* Type Badge with Animation */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-md text-foreground text-xs font-medium rounded-full shadow-md transition-all duration-300 group-hover:bg-background group-hover:scale-110 group-hover:shadow-lg animate-in fade-in slide-in-from-right duration-500">
            {property.type}
          </span>
        </div>

        {/* Animated Corner Accent */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/20 rounded-tl-full transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
      </div>

      {/* Content Section with Staggered Animations */}
      <div className="p-5 bg-card relative">
        {/* Subtle Top Border Animation */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        
        {/* Property Name */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">
          {property.name}
        </h3>

        {/* Location with Icon Animation */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4 transition-all duration-300 group-hover:text-foreground">
          <MapPin className="w-4 h-4 text-primary transition-all duration-300 group-hover:scale-125 group-hover:animate-bounce" />
          <span className="transition-all duration-300 group-hover:translate-x-1">{property.location}, {property.city}</span>
        </div>

        {/* Property Features with Hover Effects */}
        {property.bedrooms > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1 transition-all duration-300 hover:text-primary hover:scale-110 cursor-default">
              <Bed className="w-4 h-4 transition-transform duration-300" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-300 hover:text-primary hover:scale-110 cursor-default">
              <Bath className="w-4 h-4 transition-transform duration-300" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-300 hover:text-primary hover:scale-110 cursor-default">
              <Maximize className="w-4 h-4 transition-transform duration-300" />
              <span>{property.area} sq ft</span>
            </div>
          </div>
        )}

        {/* Price and Contact Section with Enhanced Styling */}
        <div className="flex items-center justify-between pt-4 border-t border-border group-hover:border-primary/30 transition-colors duration-500">
          <div className="transition-all duration-300 group-hover:translate-x-1">
            <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent'}
            </p>
            <p className="text-lg font-bold text-primary transition-all duration-300 group-hover:scale-110 origin-left bg-primary/5 px-2 py-0.5 rounded-md inline-block group-hover:bg-primary/10">
              Rs. {formatPrice(property.price)}
            </p>
          </div>
          
          {/* Enhanced Contact Button */}
          <Button 
            size="sm" 
            onClick={handleContactClick}
            className="transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 active:scale-95 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Contact</span>
            {/* Button Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </Button>
        </div>

        {/* Decorative Bottom Corner */}
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-tr-full transform -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
      </div>
    </div>
  );
};

export default PropertyCard;