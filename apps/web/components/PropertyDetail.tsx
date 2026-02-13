'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Phone, Mail, Calendar, CheckCircle2, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { propertyApi } from '@/lib/api';
import { mapBackendToFrontendProperty, BackendProperty } from '@/lib/types/property-utils';
import { Property } from '@/lib/data';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-secondary animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
});

const PropertyDetail = ({ slug }: { slug?: string }) => {
  const router = useRouter();
  const params = useParams();
  const resolvedSlug = (slug || (params?.slug as string) || (params?.id as string))?.trim();
  const [property, setProperty] = useState<Property | null>(null);
  const [backendProperty, setBackendProperty] = useState<BackendProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    features: []
  });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

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

  const jsonLd = property ? {
    '@context': 'https://schema.org',
    '@type': property.type === 'House' ? 'SingleFamilyResidence' : (property.type === 'Apartment' || property.type === 'Flat' ? 'Apartment' : 'Accommodation'),
    'name': property.name,
    'description': property.description || `${property.name} in ${property.location}, ${property.city}`,
    'image': images,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': property.city,
      'addressRegion': property.location,
      'addressCountry': 'PK'
    },
    'numberOfBedrooms': property.bedrooms,
    'numberOfBathrooms': property.bathrooms,
    'floorSize': {
      '@type': 'QuantitativeValue',
      'value': property.area,
      'unitCode': 'SQF'
    },
    'offers': {
      '@type': 'Offer',
      'price': property.price,
      'priceCurrency': 'PKR',
      'businessFunction': property.purpose === 'buy' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut',
      'availability': 'https://schema.org/InStock',
      'url': typeof window !== 'undefined' ? window.location.href : ''
    }
  } : null;

  return (
    <div className="min-h-screen bg-background">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Excerpt Section */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                        {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                      </span>
                      <span className="px-3 py-1 bg-secondary text-foreground text-sm font-medium rounded-full">
                        {property.type}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{property.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-lg capitalize">
                        {property.areaName || property.location}
                        {property.city && property.city.toLowerCase() !== (property.areaName || property.location).toLowerCase()
                          ? `, ${property.city}`
                          : ''}
                      </span>

                      {property.latitude && property.longitude && (
                        <button
                          onClick={() => document.getElementById('property-location')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-primary hover:underline text-sm ml-2 font-medium"
                        >
                          (Show on Map)
                        </button>
                      )}
                    </div>
                    {/* Short Excerpt */}
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {(backendProperty as any)?.excerpt ||
                        (property.description && property.description.length > 150
                          ? property.description.substring(0, 150) + '...'
                          : property.description) ||
                        `This beautiful ${property.type.toLowerCase()} is located in the prime area of ${property.location}, ${property.city}. 
                        Perfect for ${property.purpose === 'buy' ? 'purchasing' : 'renting'}, this property provides excellent value and comfort.`}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {/* <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? 'text-red-500' : ''}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </Button> */}
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Price and Stats */}
                <div className="flex items-center justify-between p-6 bg-secondary rounded-lg mb-6">
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
                        <Bed className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                      <div className="text-center">
                        <Bath className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Baths</p>
                      </div>
                      <div className="text-center">
                        <Maximize className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm font-semibold">{property.area}</p>
                        <p className="text-xs text-muted-foreground">sq ft</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Slider Section */}
              <section>
                <div className="relative w-full group">
                  {/* Main Image */}
                  <div
                    className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden bg-secondary cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {images.length > 0 && images[selectedImage] ? (
                      <img
                        src={images[selectedImage]}
                        alt={`${property.name} - Image ${selectedImage + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const placeholder = getPlaceholderImages(property.type)[selectedImage] || getPlaceholderImages(property.type)[0];
                          if (placeholder && target.src !== placeholder) {
                            target.src = placeholder;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No image available</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                        {selectedImage + 1} / {images.length}
                      </div>
                    )}

                    {/* Thumbnail Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${selectedImage === idx
                              ? 'bg-white w-8'
                              : 'bg-white/50 hover:bg-white/75'
                              }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip - Visible on all devices now */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
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
                  )}
                </div>
              </section>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <div
                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: property.description || `This beautiful ${property.type.toLowerCase()} is located in the prime area of ${property.location}, ${property.city}. 
                      It offers ${property.bedrooms} spacious bedrooms and ${property.bathrooms} modern bathrooms spread across ${property.area} square feet. 
                      Perfect for ${property.purpose === 'buy' ? 'purchasing' : 'renting'}, this property provides excellent value and comfort for your lifestyle needs.
                      
                      The property is situated in a well-developed neighborhood with easy access to schools, hospitals, shopping centers, and public transport. 
                      It features modern amenities and finishes throughout, making it an ideal choice for families and professionals alike.`
                    }}
                  />
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
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
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
              <Card id="property-location">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  {property.latitude && property.longitude ? (
                    <div className="space-y-4">
                      <PropertyMap
                        latitude={property.latitude}
                        longitude={property.longitude}
                        title={property.name}
                      />
                      <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold">{property.location}</p>
                          <p className="text-xs text-muted-foreground">{property.city}, Pakistan</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-secondary rounded-lg p-8 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <p className="text-lg font-semibold mb-1">{property.location}</p>
                      <p className="text-muted-foreground">{property.city}, Pakistan</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Contact Agent</h3>

                    <div className="space-y-3 mb-6">
                      <Button
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                        size="lg"
                        onClick={() => {
                          const message = encodeURIComponent(`I want to know more about this property: ${property.name}\nLink: ${window.location.href}`);
                          const waNumber = property.whatsappNumber || property.contactNumber || '923123456789';
                          // Remove any non-digit characters from the phone number
                          const cleanNumber = waNumber.replace(/\D/g, '');
                          window.open(`https://wa.me/${cleanNumber.startsWith('92') ? cleanNumber : '92' + cleanNumber.replace(/^0/, '')}?text=${message}`, '_blank');
                        }}
                      >
                        <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp Inquiry
                      </Button>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" size="lg" asChild>
                        <a href={`tel:${property.contactNumber}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call: {property.contactNumber}
                        </a>
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">Schedule a visit</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
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
                        <span className="font-semibold capitalize">{property.city}</span>
                      </div>
                      {property.areaName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-semibold capitalize">{property.areaName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-semibold capitalize">{property.location}</span>
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

      {/* Image Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-none flex items-center justify-center rounded-xl overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-50 rounded-full h-12 w-12"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-50 rounded-full h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-50 rounded-full h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-10 h-10" />
              </Button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={images[selectedImage]}
              alt={`${property.name} - Full Image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;