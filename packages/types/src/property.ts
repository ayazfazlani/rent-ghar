export interface CreatePropertyDto {
    listingType: 'rent' | 'sale'
    propertyType: 'house' | 'apartment' | 'flat' | 'commercial'
    city: string
    title: string
    location: string
    bedrooms: number
    bathrooms: number
    area: number // sq ft
    price: number // PKR
    description: string
    contactNumber: string
    features?: string[]
  }