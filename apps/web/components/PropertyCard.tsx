 'use client'
import { useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/lib/data';

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
      className="property-card group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-secondary">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
            {property.type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {property.name}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{property.location}, {property.city}</span>
        </div>

        {property.bedrooms > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.area} sq ft</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">
              {property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent'}
            </p>
            <p className="text-lg font-bold text-primary">
              Rs. {formatPrice(property.price)}
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleContactClick}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;