 export interface Property {
  id: string; // ✅ STRING mein change kiya
  name: string;
  type: 'House' | 'Apartment' | 'Flat' | 'Commercial';
  city: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  purpose: 'rent' | 'buy';
  image: string;
  featured?: boolean;
  description?: string;
  features?: string[];
  areaId?: string; // Area ObjectId
  areaName?: string; // Area name
}

export interface Hotel {
  id: string; // ✅ STRING mein change kiya
  name: string;
  city: string;
  location: string;
  price: number;
  rating: number;
  rooms: number;
  description: string;
  amenities: string[];
  image: string;
}

export const properties: Property[] = [
  {
    id: '1', // ✅ QUOTES add kiye
    name: "Modern Villa with Garden",
    type: "House",
    city: "Multan",
    location: "Bosan Road",
    price: 45000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    featured: true
  },
  {
    id: '2', // ✅ QUOTES add kiye
    name: "Luxury Apartment",
    type: "Apartment",
    city: "Lahore",
    location: "DHA Phase 5",
    price: 35000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    purpose: "buy",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    featured: true
  },
  {
    id: '3', // ✅ QUOTES add kiye
    name: "Cozy Family Home",
    type: "House",
    city: "Islamabad",
    location: "F-10",
    price: 85000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: true
  },
  {
    id: '4', // ✅ QUOTES add kiye
    name: "Commercial Plaza",
    type: "Commercial",
    city: "Karachi",
    location: "Clifton",
    price: 150000,
    bedrooms: 0,
    bathrooms: 4,
    area: 5000,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    featured: true
  },
  {
    id: '5', // ✅ QUOTES add kiye
    name: "Studio Flat",
    type: "Flat",
    city: "Multan",
    location: "Gulgasht Colony",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    featured: true
  },
  {
    id: '6', // ✅ QUOTES add kiye
    name: "Executive Bungalow",
    type: "House",
    city: "Lahore",
    location: "Gulberg III",
    price: 75000000,
    bedrooms: 6,
    bathrooms: 5,
    area: 4500,
    purpose: "buy",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: true
  },
  {
    id: '7', // ✅ QUOTES add kiye
    name: "Modern Penthouse",
    type: "Apartment",
    city: "Karachi",
    location: "Bahria Town",
    price: 120000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
  },
  {
    id: '8', // ✅ QUOTES add kiye
    name: "Budget Friendly Flat",
    type: "Flat",
    city: "Islamabad",
    location: "G-11",
    price: 25000,
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    purpose: "rent",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80"
  }
];

export const hotels: Hotel[] = [
  {
    id: '1', // ✅ QUOTES add kiye
    name: "Pearl Continental Multan",
    city: "Multan",
    location: "Khanewal Road",
    price: 15000,
    rating: 4.5,
    rooms: 150,
    description: "Experience luxury and comfort at the heart of Multan with world-class amenities and exceptional service.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Parking"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
  },
  {
    id: '2', // ✅ QUOTES add kiye
    name: "Serena Hotel",
    city: "Islamabad",
    location: "Constitution Avenue",
    price: 28000,
    rating: 4.8,
    rooms: 200,
    description: "A premium 5-star hotel offering unparalleled luxury in the capital city with stunning mountain views.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Business Center"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
  },
  {
    id: '3', // ✅ QUOTES add kiye
    name: "Movenpick Hotel",
    city: "Karachi",
    location: "Club Road",
    price: 22000,
    rating: 4.6,
    rooms: 180,
    description: "Swiss hospitality meets Pakistani warmth in this elegant hotel near the Arabian Sea.",
    amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Gym", "Conference"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
  },
  {
    id: '4', // ✅ QUOTES add kiye
    name: "Avari Hotel",
    city: "Lahore",
    location: "Mall Road",
    price: 18000,
    rating: 4.4,
    rooms: 160,
    description: "A heritage hotel blending Mughal architecture with modern amenities in historic Lahore.",
    amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Parking", "Lounge"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
  }
];

export const cities = ['Multan', 'Lahore', 'Karachi', 'Islamabad'] as const;
export const propertyTypes = ['House', 'Apartment', 'Flat', 'Commercial'] as const;