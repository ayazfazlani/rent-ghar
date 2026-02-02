 'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Phone, Mail, Calendar, CheckCircle2, X, Loader2, ChevronLeft, ChevronRight, MessageCircle, Building2, Home as HomeIcon, TrendingUp, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'trends'>('overview');
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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-black font-semibold">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Property Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <Button 
            onClick={() => router.push('/properties')} 
            className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 font-semibold"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const getImages = (): string[] => {
    if (!property) return getPlaceholderImages('House');
    
    const isValidImageUrl = (url?: string): boolean => {
      if (!url) return false;
      if (url.includes('localhost/uploads/')) return false;
      return url.startsWith('http://') || url.startsWith('https://');
    };
    
    const validImages: string[] = [];
    
    if (backendProperty && isValidImageUrl(backendProperty.mainPhotoUrl)) {
      validImages.push(backendProperty.mainPhotoUrl!);
    }
    
    if (backendProperty?.additionalPhotosUrls) {
      backendProperty.additionalPhotosUrls.forEach(url => {
        if (isValidImageUrl(url)) {
          validImages.push(url);
        }
      });
    }
    
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

  const calculateMarla = (area: number) => {
    const marla = area / 272.25;
    return marla.toFixed(2);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
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
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in this property: ${property.name} - ${property.location}, ${property.city}. Price: Rs. ${formatPrice(property.price)}`;
    const phoneNumber = '923001234567'; // Replace with actual agent number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Main Content */}
      <div className="pt-20">
        {/* Image Slider Section */}
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Image Slider */}
              <div className="lg:col-span-3">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  {images.length > 0 && images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={property.name}
                      className="w-full h-[400px] md:h-[600px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const placeholder = getPlaceholderImages(property.type)[0];
                        if (placeholder && target.src !== placeholder) {
                          target.src = placeholder;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-[400px] md:h-[600px] bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500 font-medium">No image available</p>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white text-black rounded-full transition-all shadow-xl hover:scale-110 flex items-center justify-center"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white text-black rounded-full transition-all shadow-xl hover:scale-110 flex items-center justify-center"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {images.length > 0 && (
                    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {selectedImage + 1} / {images.length}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex gap-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`w-11 h-11 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center transition-all ${
                        isLiked ? 'text-red-500' : 'text-gray-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-lg flex items-center justify-center transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all ${
                        selectedImage === idx 
                          ? 'ring-3 ring-black scale-105' 
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${idx + 1}`} 
                        className="w-20 h-20 md:w-24 md:h-24 object-cover"
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

              {/* Right Sidebar - IMPROVED DESIGN */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 bg-white shadow-lg rounded-2xl border border-gray-200">
                  <CardContent className="p-5 space-y-4">
                    {/* Price */}
                    <div className="text-center pb-4 border-b border-gray-200">
                      <p className="text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">
                        {property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent'}
                      </p>
                      <p className="text-2xl md:text-2xl font-extrabold text-black">
                        Rs. {formatPrice(property.price)}
                      </p>
                    </div>

                    {/* Property Stats - COMPACT DESIGN */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 text-[11px] font-semibold flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5 text-gray-600" />
                          Marla
                        </span>
                        <span className="font-bold text-sm text-black">{calculateMarla(property.area)}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 text-[11px] font-semibold flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5 text-gray-600" />
                          Area
                        </span>
                        <span className="font-bold text-sm text-black">{property.area} sqft</span>
                      </div>

                      {property.bedrooms > 0 && (
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 text-[11px] font-semibold flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-gray-600" />
                            Bedrooms
                          </span>
                          <span className="font-bold text-sm text-black">{property.bedrooms}</span>
                        </div>
                      )}

                      {property.bathrooms > 0 && (
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 text-[11px] font-semibold flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5 text-gray-600" />
                            Bathrooms
                          </span>
                          <span className="font-bold text-sm text-black">{property.bathrooms}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Buttons - IMPROVED WHATSAPP DESIGN */}
                    <div className="space-y-2 pt-1">
                      {/* WhatsApp Button - White with Green Border */}
                      <button 
                        className="w-full bg-white hover:bg-green-50 text-green-600 border-2 border-green-600 hover:border-green-700 rounded-full py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm" 
                        onClick={handleWhatsApp}
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Inquiry
                      </button>

                      <button 
                        className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm" 
                        onClick={() => setShowContactForm(true)}
                      >
                        <Mail className="w-4 h-4" />
                        Send Email
                      </button>
                      
                      <button 
                        className="w-full border-2 border-gray-300 hover:border-black hover:bg-gray-50 text-black rounded-full py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Agent
                      </button>
                    </div>

                    {/* Property ID - IMPROVED STRUCTURE */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-500 font-semibold text-[9px] uppercase tracking-wider mb-1.5">Property ID</p>
                        <p className="font-mono font-bold text-black text-[10px] break-all leading-relaxed">
                          {property.id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs - Matching Header Style */}
        <div className="bg-white border-t border-b border-gray-200 sticky top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'text-white bg-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'location'
                    ? 'text-white bg-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Location & Nearby
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'trends'
                    ? 'text-white bg-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Trends
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 max-w-5xl">
              {/* Header */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-bold rounded-full uppercase">
                    {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-full uppercase">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-black mb-2 leading-tight">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  <span className="text-sm font-medium">{property.location}, {property.city}</span>
                </div>
              </div>

              {/* Details Card */}
              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-5 py-2.5">
                  <h2 className="text-base font-bold text-white">Details</h2>
                </div>
                <CardContent className="p-5 bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Type</span>
                      <span className="font-bold text-black text-xs">{property.type}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Price</span>
                      <span className="font-bold text-black text-xs">PKR {formatPrice(property.price)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Purpose</span>
                      <span className="font-bold text-black text-xs">
                        {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Bedroom(s)</span>
                      <span className="font-bold text-black text-xs">
                        {property.bedrooms > 0 ? property.bedrooms : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Bath(s)</span>
                      <span className="font-bold text-black text-xs">
                        {property.bathrooms > 0 ? property.bathrooms : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium text-xs">Area</span>
                      <span className="font-bold text-black text-xs">{property.area} sqft</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-5 py-2.5">
                  <h2 className="text-base font-bold text-white">Description</h2>
                </div>
                <CardContent className="p-5 bg-white">
                  <p className="text-gray-700 leading-relaxed text-xs">
                    {property.description || `This beautiful ${property.type.toLowerCase()} is located in the prime area of ${property.location}, ${property.city}. 
                    It offers ${property.bedrooms} spacious bedrooms and ${property.bathrooms} modern bathrooms spread across ${property.area} square feet (${calculateMarla(property.area)} Marla). 
                    Perfect for ${property.purpose === 'buy' ? 'purchasing' : 'renting'}, this property provides excellent value and comfort for your lifestyle needs.
                    
                    The property is situated in a well-developed neighborhood with easy access to schools, hospitals, shopping centers, and public transport. 
                    It features modern amenities and finishes throughout, making it an ideal choice for families and professionals alike.`}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {backendProperty?.features && backendProperty.features.length > 0 && (
                <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-black px-5 py-2.5">
                    <h2 className="text-base font-bold text-white">Features & Amenities</h2>
                  </div>
                  <CardContent className="p-5 bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {backendProperty.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 p-1.5 hover:bg-gray-50 transition-colors rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black flex-shrink-0" />
                          <span className="text-gray-700 text-xs font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Safety Guidelines - LAST SECTION */}
              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-5 py-2.5">
                  <h2 className="text-base font-bold text-white">Property Transaction Safety</h2>
                </div>
                <CardContent className="p-5 bg-white">
                  <ul className="space-y-2 text-gray-700 text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>Always ensure that you meet the other party in a safe and public area preferably during the daylight.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>Do not pay in advance before due property verification and all the legal formalities have been properly completed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>Critically examine the house and have everything that was posted in the listing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>Always ensure that the ownership documents are verified and they are authentic with the corresponding authorities before making a final deal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>You should never give out any personal or financial details which are sensitive unless you have complete trust and verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5 text-xs">•</span>
                      <span>Always be alert and call the Rent Ghar support staff in case of any suspicious behavior.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-6 py-3">
                  <h2 className="text-lg font-bold text-white">Location</h2>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {/* Location Header */}
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xl font-bold mb-2 text-black">{property.location}</p>
                      <p className="text-base text-gray-600 font-semibold">{property.city}, Pakistan</p>
                    </div>

                    {/* Location Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-base font-bold text-black mb-3">Address Information</h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700"><span className="font-semibold">Area:</span> {property.location}</p>
                          <p className="text-gray-700"><span className="font-semibold">City:</span> {property.city}</p>
                          <p className="text-gray-700"><span className="font-semibold">Province:</span> Punjab, Pakistan</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-bold text-black mb-3">Accessibility</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p>• Well-connected to main roads</p>
                          <p>• Easy access to public transport</p>
                          <p>• Close to major highways</p>
                          <p>• Nearby commercial areas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-6 py-3">
                  <h2 className="text-lg font-bold text-white">Nearby Places</h2>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Schools */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-black">Schools</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Schools within 2-3 km</li>
                        <li>• Colleges nearby</li>
                        <li>• Educational institutions accessible</li>
                      </ul>
                    </div>

                    {/* Healthcare */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="font-bold text-black">Healthcare</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Hospitals within reach</li>
                        <li>• Medical centers nearby</li>
                        <li>• Pharmacies available</li>
                      </ul>
                    </div>

                    {/* Shopping */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-bold text-black">Shopping</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Shopping malls accessible</li>
                        <li>• Local markets nearby</li>
                        <li>• Grocery stores available</li>
                      </ul>
                    </div>

                    {/* Restaurants */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-black">Dining</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Restaurants nearby</li>
                        <li>• Cafes and eateries</li>
                        <li>• Food courts available</li>
                      </ul>
                    </div>

                    {/* Transport */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-black">Transport</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Public transport accessible</li>
                        <li>• Taxi/ride services available</li>
                        <li>• Main roads nearby</li>
                      </ul>
                    </div>

                    {/* Recreation */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-pink-600" />
                        </div>
                        <h3 className="font-bold text-black">Recreation</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Parks and playgrounds</li>
                        <li>• Gyms and fitness centers</li>
                        <li>• Entertainment venues</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6 max-w-5xl">
              <Card className="shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-black px-6 py-3">
                  <h2 className="text-lg font-bold text-white">Market Trends</h2>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {/* Trends Header */}
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xl font-bold mb-2 text-black">Property Market Analysis</p>
                      <p className="text-base text-gray-600 font-semibold">{property.location}, {property.city}</p>
                    </div>

                    {/* Market Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Market Status</p>
                            <p className="text-lg font-bold text-black">Growing</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">The area shows positive growth trends with increasing demand.</p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <HomeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Property Demand</p>
                            <p className="text-lg font-bold text-black">High</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Strong demand for {property.type.toLowerCase()}s in this location.</p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Development</p>
                            <p className="text-lg font-bold text-black">Active</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Ongoing infrastructure and community development.</p>
                      </div>
                    </div>

                    {/* Price Trends */}
                    <div>
                      <h3 className="text-base font-bold text-black mb-4">Price Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h4 className="text-sm font-bold text-black mb-3">Average Price per Sqft</h4>
                            <p className="text-2xl font-extrabold text-black mb-2">PKR {Math.round(property.price / property.area).toLocaleString('en-PK')}</p>
                            <p className="text-xs text-gray-600">Based on current market rates in {property.location}</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h4 className="text-sm font-bold text-black mb-3">Investment Potential</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                              <p>• Growing property values</p>
                              <p>• Good rental yields expected</p>
                              <p>• Strong resale potential</p>
                              <p>• Developing infrastructure</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Area Highlights */}
                    <div>
                      <h3 className="text-base font-bold text-black mb-4">Area Highlights</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Prime residential area with modern facilities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Well-planned infrastructure and roads</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Close to commercial and business hubs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Good connectivity to main city areas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Safe and secure neighborhood</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Access to quality schools and hospitals</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-md border border-gray-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Contact Agent</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-xl border-gray-300 focus:border-black"
              required
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 rounded-xl border-gray-300 focus:border-black"
              required
            />
            <Input
              type="tel"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 rounded-xl border-gray-300 focus:border-black"
              required
            />
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="rounded-xl border-gray-300 focus:border-black"
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-black hover:bg-gray-800 text-white rounded-full"
            >
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;