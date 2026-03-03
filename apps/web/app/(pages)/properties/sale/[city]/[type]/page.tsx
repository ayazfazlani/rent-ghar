import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    city: string;
    type: string;
  }>;
}

async function resolveTypeOrArea(citySlug: string, paramType: string) {
  try {
    const cityData = await serverApi.getCityByName(citySlug);
    if (!cityData) return { cityData: null, isPropertyType: false, areaData: null };

    // Get all property types to check against
    const propertyTypes = await serverApi.getTypes();

    // Normalize for comparison (case-insensitive)
    const normalizedParam = paramType.toLowerCase();
    // Check if it matches a known property type
    const matchedType = propertyTypes.find(t => t.toLowerCase() === normalizedParam);

    if (matchedType) {
      return { cityData, isPropertyType: true, propertyType: matchedType, areaData: null };
    }

    // If not a property type, try to find an area with this slug
    try {
      const areaData = await serverApi.getAreaBySlug(paramType, cityData._id);
      return { cityData, isPropertyType: false, propertyType: null, areaData };
    } catch (e) {
      return { cityData, isPropertyType: false, propertyType: null, areaData: null };
    }
  } catch (error) {
    console.error('Error resolving route params:', error);
    return { cityData: null, isPropertyType: false, areaData: null };
  }
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: citySlug, type } = await props.params;

  const { cityData, isPropertyType, areaData, propertyType } = await resolveTypeOrArea(citySlug, type);

  if (!cityData) {
    return { title: `Properties for Sale in ${citySlug} ` };
  }

  if (isPropertyType && propertyType) {
    const typeCapitalized = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
    return {
      title: cityData.saleMetaTitle || cityData.metaTitle
        ? `${typeCapitalized} - ${cityData.saleMetaTitle || cityData.metaTitle}`
        : `${typeCapitalized} for Sale in ${cityData.name} `,
      description: cityData.saleMetaDescription || cityData.metaDescription || `Find the best ${propertyType} for sale in ${cityData.name}. Browse latest listings on Property Dealer.`,
      alternates: {
        canonical: cityData.canonicalUrl || undefined,
      },
    };
  }

  if (areaData) {
    return {
      title: areaData.metaTitle || `Properties for Sale in ${areaData.name}, ${cityData.name} `,
      description: areaData.metaDescription || `Find properties for sale in ${areaData.name}, ${cityData.name}. Browse latest listings on Property Dealer.`,
      alternates: {
        canonical: areaData.canonicalUrl || undefined,
      },
    };
  }

  return {
    title: `Properties for Sale in ${citySlug} `,
  };
}

export default async function SaleCityTypePage(props: PageProps) {
  const { city, type } = await props.params;

  const { cityData, isPropertyType, areaData, propertyType } = await resolveTypeOrArea(city, type);

  if (!cityData) {
    console.error(`City ${city} not found`);
  }

  const listingType = isPropertyType ? (propertyType || type) : 'all';
  const areaId = areaData?._id;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing
        purpose="buy"
        city={city}
        type={listingType}
        areaId={areaId}
        useCleanUrls={true}
        richDescription={areaData?.description || cityData?.saleContent}
      />
    </Suspense>
  );
}
