import { Property } from './data';

// Backend property type (from API response)
export interface BackendProperty {
  _id: string;
  listingType: 'rent' | 'sale';
  propertyType: 'house' | 'apartment' | 'flat' | 'commercial';
  city: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
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

  return {
    id: backend._id,
    name: backend.title,
    type: typeMap[backend.propertyType] || 'House',
    city: backend.city,
    location: backend.location,
    price: backend.price,
    bedrooms: backend.bedrooms,
    bathrooms: backend.bathrooms,
    area: backend.area,
    purpose: purposeMap[backend.listingType] || 'rent',
    image: backend.mainPhotoUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    description: backend.description,
    features: backend.features || [],
  };
}

