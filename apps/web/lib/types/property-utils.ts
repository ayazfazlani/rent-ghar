import { Property } from '../data';

// Backend property type (from API response)
export interface BackendProperty {
  _id: string;
  listingType: 'rent' | 'sale';
  propertyType: 'house' | 'apartment' | 'flat' | 'commercial';
  city?: string; // Legacy field, may not be present
  area?: {
    _id: string;
    name: string;
    city?: {
      _id: string;
      name: string;
      state: string;
      country: string;
    };
  } | string; // Can be populated object (Area) or ObjectId string
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSize?: number; // Property size in sq ft (new field)
  price: number;
  description: string;
  contactNumber: string;
  features?: string[];
  mainPhotoUrl?: string;
  additionalPhotosUrls?: string[];
  status: 'pending' | 'approved' | 'rejected';
  owner?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Map backend property to frontend property format
export function mapBackendToFrontendProperty(backend: BackendProperty): Property {
  // Map propertyType to frontend format (capitalize first letter)
  const typeMap: Record<string, 'House' | 'Apartment' | 'Flat' | 'Commercial'> = {
    house: 'House',
    apartment: 'Apartment',
    flat: 'Flat',
    commercial: 'Commercial',
  };

  // Map listingType to purpose
  const purposeMap: Record<'rent' | 'sale', 'rent' | 'buy'> = {
    rent: 'rent',
    sale: 'buy',
  };

  // Extract city name from area.city or fallback to legacy city field
  let cityName = backend.city || '';
  if (backend.area && typeof backend.area === 'object' && backend.area.city) {
    cityName = backend.area.city.name;
  }

  // Extract area name
  const areaName = backend.area && typeof backend.area === 'object' ? backend.area.name : '';

  return {
    id: backend._id,
    name: backend.title,
    type: typeMap[backend.propertyType] || 'House',
    city: cityName,
    location: backend.location,
    price: backend.price,
    bedrooms: backend.bedrooms,
    bathrooms: backend.bathrooms,
    area: backend.areaSize || 0, // Property size in sq ft
    purpose: purposeMap[backend.listingType] || 'rent',
    image: backend.mainPhotoUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    description: backend.description,
    features: backend.features || [],
    areaId: backend.area && typeof backend.area === 'object' ? backend.area._id : (typeof backend.area === 'string' ? backend.area : undefined),
    areaName: areaName,
  };
}

