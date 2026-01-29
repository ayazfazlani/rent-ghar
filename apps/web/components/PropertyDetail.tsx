'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Phone, Mail, Calendar, CheckCircle2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';
import { toast } from 'sonner';

const PropertyDetail = ({ slug }: { slug?: string }) => {
  const router = useRouter();
  const params = useParams();
  const resolvedSlug = (slug || (params?.slug as string) || (params?.id as string))?.trim();
  const [property, setProperty] = useState<Property | null>(null);
  const [backendProperty, setBackendProperty] = useState<BackendProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    features: []
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propertyApi.getPropertyBySlug({ slug: resolvedSlug });
        const backendData = data as BackendProperty;
        const mappedProperty = mapBackendToFrontendProperty(backendData);
        setProperty(mappedProperty);
        setBackendProperty(backendData);
      } catch (err: any) {
        console.error('Error fetching property:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load property';
        setError(errorMessage);
        toast.error('Error', {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    if (!resolvedSlug) {
      setError('Property slug is missing');
      setLoading(false);
      return;
    }

    fetchProperty();
  }, [resolvedSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/properties')}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  // Get images from property or use placeholders
  const getImages = (): string[] => {
    if (!property) return getPlaceholderImages('House');
    
    // Convert image URL to full URL if needed
    const getImageUrl = (url?: string): string | null => {
      if (!url) return null;
      // If it's already a full URL, return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // If it's a relative path like /uploads/..., use Next.js proxy
      if (url.startsWith('/uploads/')) {
        // Next.js rewrite will handle /uploads/... -> http://localhost:3001/uploads/...
        return url;
      }
      return null;
    };
    
    const validImages: string[] = [];
    
    // Add main photo if valid
    if (backendProperty) {
      const mainPhotoUrl = getImageUrl(backendProperty.mainPhotoUrl);
      if (mainPhotoUrl) {
        validImages.push(mainPhotoUrl);
      }
    }
    
    // Add additional photos if valid
    if (backendProperty?.additionalPhotosUrls) {
      backendProperty.additionalPhotosUrls.forEach(url => {
        const imageUrl = getImageUrl(url);
        if (imageUrl) {
          validImages.push(imageUrl);
        }
      });
    }
    
    // Return valid images or fallback to placeholders
    return validImages.length > 0 ? validImages : getPlaceholderImages(property.type);
  };

  const getPlaceholderImages = (type: string): string[] => {
    const imagesByType: { [key: string]: string[] } = {
      'House': [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
        'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1200&q=80'
      ],
      'Apartment': [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80'
      ],
      'Villa': [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80'
      ],
      'Plot': [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'
      ],
      'Commercial': [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80'
      ],
      'Farm House': [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=1200&q=80',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80'
      ]
    };
    return imagesByType[type] || imagesByType['House'] || [];
  };

  const images = getImages();
  const formatPrice = (price: number) => price.toLocaleString('en-PK');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Contact form submitted! In production, this would send to your backend.');
    setShowContactForm(false);
    setFormData({ name: '', email: '', phone: '', message: '', features: [] });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out this property: ${property.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const features = [
    'Electricity Backup',
    'Waste Disposal',
    'Flooring',
    'Elevators',
    'Service Elevators Lifts',
    'Parking Spaces',
    'Security Staff',
    'CCTV Security',
    'Lawn or Garden',
    'Nearby Schools',
    'Nearby Hospitals',
    'Nearby Shopping Malls',
    'Nearby Restaurants',
    'Distance From Airport',
    'Nearby Public Transport',
    'Other Nearby Places'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24">
        {/* Image Gallery */}
        <section className="bg-black">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-4 gap-2 max-h-[600px]">
              <div className="col-span-4 md:col-span-3 relative">
                {images.length > 0 && images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={property.name}
                    className="w-full h-[400px] md:h-[600px] object-cover rounded-lg"
                    onError={(e) => {
                      // If image fails to load, use placeholder
                      const target = e.target as HTMLImageElement;
                      const placeholder = getPlaceholderImages(property.type)[0];
                      if (placeholder && target.src !== placeholder) {
                        target.src = placeholder;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-[400px] md:h-[600px] bg-secondary rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>
              <div className="hidden md:flex md:flex-col gap-2">
                {images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-[195px] object-cover hover:opacity-75 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const placeholder = getPlaceholderImages(property.type)[idx] || getPlaceholderImages(property.type)[0];
                        if (placeholder && target.src !== placeholder) {
                          target.src = placeholder;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Thumbnail Strip */}
            <div className="flex md:hidden gap-2 mt-2 overflow-x-auto">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${idx + 1}`} 
                    className="w-20 h-20 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const placeholder = getPlaceholderImages(property.type)[idx] || getPlaceholderImages(property.type)[0];
                      if (placeholder && target.src !== placeholder) {
                        target.src = placeholder;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                        {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                      </span>
                      <span className="px-3 py-1 bg-secondary text-foreground text-sm font-medium rounded-full">
                        {property.type}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{property.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-lg">{property.location}, {property.city}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? 'text-red-500' : ''}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent'}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      Rs. {formatPrice(property.price)}
                    </p>
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="flex gap-6">
                      <div className="text-center">
                        <Bed className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                      <div className="text-center">
                        <Bath className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Baths</p>
                      </div>
                      <div className="text-center">
                        <Maximize className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.area}</p>
                        <p className="text-xs text-muted-foreground">sq ft</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || `This beautiful ${property.type.toLowerCase()} is located in the prime area of ${property.location}, ${property.city}. 
                    It offers ${property.bedrooms} spacious bedrooms and ${property.bathrooms} modern bathrooms spread across ${property.area} square feet. 
                    Perfect for ${property.purpose === 'buy' ? 'purchasing' : 'renting'}, this property provides excellent value and comfort for your lifestyle needs.
                    
                    The property is situated in a well-developed neighborhood with easy access to schools, hospitals, shopping centers, and public transport. 
                    It features modern amenities and finishes throughout, making it an ideal choice for families and professionals alike.`}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
                    {backendProperty?.features && backendProperty.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {backendProperty.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No features listed for this property.</p>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <div className="bg-secondary rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <p className="text-lg font-semibold mb-1">{property.location}</p>
                    <p className="text-muted-foreground">{property.city}, Pakistan</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Contact Agent</h3>
                    
                    <div className="space-y-3 mb-6">
                      <Button className="w-full" size="lg" onClick={() => setShowContactForm(true)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">Schedule a visit</p>
                     </div>
                  </CardContent>
                </Card>

                {/* Property ID */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3">Property Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property ID:</span>
                        <span className="font-semibold">{property.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-semibold">{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Purpose:</span>
                        <span className="font-semibold">
                          {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City:</span>
                        <span className="font-semibold">{property.city}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;