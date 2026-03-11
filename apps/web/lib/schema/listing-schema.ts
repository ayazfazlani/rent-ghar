// lib/schema/listing-schema.ts
// Schema.org JSON-LD generators for property listing pages

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://rent-ghar.com';

// Map property type string → schema.org @type
function getSchemaType(propertyType: string): string {
  const t = propertyType.toLowerCase().trim();
  if (['flat', 'apartment'].includes(t)) return 'Apartment';
  if (t === 'house') return 'SingleFamilyResidence';
  if (['plot', 'land'].includes(t)) return 'LandForm';
  if (t === 'shop') return 'Store';
  if (t === 'office') return 'OfficeBuilding';
  if (t === 'commercial') return 'CommercialProperty';
  if (t === 'factory') return 'IndustrialBuilding';
  if (t === 'hotel') return 'Hotel';
  if (t === 'restaurant') return 'Restaurant';
  return 'RealEstateListing';
}

// ItemList schema for a page showing multiple properties
export function buildItemListSchema(
  properties: Array<{
    id: string;
    slug?: string;
    name: string;
    type: string;
    price: number;
    purpose: string;
    city: string;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    image?: string;
    createdAt?: string;
  }>,
  pageUrl: string,
  pageTitle: string
) {
  const items = properties.map((p, index) => {
    const detailUrl = `${BASE_URL}/p/${p.slug || p.id}`;
    const isResidential = ['flat', 'apartment', 'house'].some(t => p.type?.toLowerCase() === t);
    const isSale = p.purpose === 'buy' || p.purpose === 'sale';

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: p.name || `${p.type} in ${p.city}`,
        url: detailUrl,
        ...(p.image && { image: p.image }),
        datePosted: p.createdAt
          ? new Date(p.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        offers: {
          '@type': 'Offer',
          price: String(Math.round(p.price)),
          priceCurrency: 'PKR',
          businessFunction: isSale
            ? 'https://purl.org/goodrelations/v1#Sell'
            : 'https://purl.org/goodrelations/v1#LeaseOut',
          availability: 'https://schema.org/InStock',
          url: detailUrl,
        },
        itemOffered: {
          '@type': getSchemaType(p.type),
          ...(isResidential && p.bedrooms !== undefined && {
            numberOfBedrooms: p.bedrooms,
            numberOfBathroomsTotal: p.bathrooms,
          }),
          ...(p.area && {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: String(p.area),
              unitText: 'sqft',
            },
          }),
          address: {
            '@type': 'PostalAddress',
            addressLocality: p.location || p.city,
            addressRegion: p.city,
            addressCountry: 'PK',
          },
        },
      },
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: pageUrl,
    numberOfItems: properties.length,
    itemListElement: items,
  };
}

// BreadcrumbList schema for navigation
export function buildBreadcrumbSchema(
  crumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// RealEstateAgent / SearchAction schema for city landing pages
export function buildSearchActionSchema(cityName: string, citySlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/properties/all/${citySlug}/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Full single-property schema for detail pages
export function buildPropertySchema(property: {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  propertyType: string;
  listingType: 'rent' | 'sale';
  price: number;
  location?: string;
  city?: string;
  areaName?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSize?: number;
  marla?: number;
  mainPhotoUrl?: string;
  additionalPhotosUrls?: string[];
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  features?: string[];
}) {
  const url = `${BASE_URL}/p/${property.slug || property.id}`;
  const isSale = property.listingType === 'sale';
  const isResidential = ['house', 'apartment', 'flat'].includes(property.propertyType?.toLowerCase());
  const isPlot = ['plot', 'land'].includes(property.propertyType?.toLowerCase());
  const isCommercial = ['office', 'shop', 'commercial', 'factory', 'hotel', 'restaurant', 'warehouse'].includes(property.propertyType?.toLowerCase());

  const images = [
    ...(property.mainPhotoUrl ? [property.mainPhotoUrl] : []),
    ...(property.additionalPhotosUrls || []),
  ];

  const baseType = getSchemaType(property.propertyType);

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url,
    description: property.description,
    datePosted: property.createdAt
      ? new Date(property.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    ...(images.length > 0 && { image: images }),

    offers: {
      '@type': 'Offer',
      price: String(Math.round(property.price)),
      priceCurrency: 'PKR',
      businessFunction: isSale
        ? 'https://purl.org/goodrelations/v1#Sell'
        : 'https://purl.org/goodrelations/v1#LeaseOut',
      availability: 'https://schema.org/InStock',
      url,
    },

    itemOffered: {
      '@type': baseType,
      name: property.title,
      description: property.description,

      // Address
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location,
        addressLocality: property.areaName || property.location,
        addressRegion: property.city,
        addressCountry: 'PK',
      },

      // Geo coordinates if available
      ...(property.latitude && property.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: property.latitude,
          longitude: property.longitude,
        },
      }),

      // Residential-specific
      ...(isResidential && {
        ...(property.bedrooms !== undefined && { numberOfBedrooms: property.bedrooms }),
        ...(property.bathrooms !== undefined && { numberOfBathroomsTotal: property.bathrooms }),
        ...(property.areaSize && {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: String(property.areaSize),
            unitText: 'sqft',
          },
        }),
        ...(property.features?.length && {
          amenityFeature: property.features.map(f => ({
            '@type': 'LocationFeatureSpecification',
            name: f,
            value: true,
          })),
        }),
      }),

      // Plot/Land-specific
      ...(isPlot && {
        ...(property.marla && {
          areaServed: {
            '@type': 'QuantitativeValue',
            value: String(property.marla),
            unitText: 'Marla',
          },
        }),
        ...(property.areaSize && {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: String(property.areaSize),
            unitText: 'sqft',
          },
        }),
      }),

      // Commercial-specific
      ...(isCommercial && {
        ...(property.areaSize && {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: String(property.areaSize),
            unitText: 'sqft',
          },
        }),
        ...(property.features?.length && {
          amenityFeature: property.features.map(f => ({
            '@type': 'LocationFeatureSpecification',
            name: f,
            value: true,
          })),
        }),
      }),
    },
  };

  return schema;
}

