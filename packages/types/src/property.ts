export interface CreatePropertyDto {
    listingType: 'rent' | 'sale'
    propertyType: 'house' | 'apartment' | 'flat' | 'commercial' | 'land' | 'shop' | 'office' | 'warehouse' | 'factory' | 'other' | 'hotel' | 'restaurant' | 'plot'
    area: string // Area ID (ObjectId) - references the Area schema
    title: string
    location: string
    bedrooms: number
    bathrooms: number
    areaSize: number // sq ft - property size
    price: number // PKR
    description: string
    contactNumber: string
    features?: string[]
  }