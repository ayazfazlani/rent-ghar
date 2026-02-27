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
    // Check if it matches a known property type (some might be capitalized in DB/API)
    const matchedType = propertyTypes.find(t => t.toLowerCase() === normalizedParam);

    if (matchedType) {
      return { cityData, isPropertyType: true, propertyType: matchedType, areaData: null };
    }

    // If not a property type, try to find an area with this slug in this city
    try {
      const areaData = await serverApi.getAreaBySlug(paramType, cityData._id);
      return { cityData, isPropertyType: false, propertyType: null, areaData };
    } catch (e) {
      // Area not found either
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
    return { title: `Properties in ${citySlug} ` };
  }

  if (isPropertyType && propertyType) {
    const typeCapitalized = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
    return {
      title: cityData.metaTitle
        ? `${typeCapitalized} - ${cityData.metaTitle}`
        : `${typeCapitalized} for Rent & Sale in ${cityData.name} `,
      description: cityData.metaDescription || `Find the best ${propertyType} for rent and sale in ${cityData.name}. Browse latest listings.`,
      alternates: {
        canonical: cityData.canonicalUrl || undefined,
      },
    };
  }

  if (areaData) {
    return {
      title: areaData.metaTitle || `Properties in ${areaData.name}, ${cityData.name} `,
      description: areaData.metaDescription || `Find properties for rent and sale in ${areaData.name}, ${cityData.name}. Browse latest listings.`,
      alternates: {
        canonical: areaData.canonicalUrl || undefined,
      },
    };
  }

  // Fallback if neither (e.g. 404 implicitly, but we return basic metadata)
  return {
    title: `Properties in ${citySlug} `,
  };
}

export default async function AllCityTypePage(props: PageProps) {
  const { city, type } = await props.params;

  const { cityData, isPropertyType, areaData, propertyType } = await resolveTypeOrArea(city, type);

  // If city not found, show 404
  if (!cityData) {
    // We could return notFound() here, but the original code just logged error. 
    // Let's stick to safe fallback or error page.
    console.error(`City ${city} not found`);
  }

  // If it's valid area, we render listing with areaId
  // If it's valid property type, we render listing with type
  // If neither, it might be a 404 for the type/area. 

  // Decide what to pass to PropertiesListing
  const listingType = isPropertyType ? (propertyType || type) : 'all';
  const areaId = areaData?._id;
  const description = areaData?.description || cityData?.description;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing
        purpose="all"
        city={city}
        type={listingType}
        areaId={areaId}
        useCleanUrls={true}
        richDescription={description}
      />
    </Suspense>
  );
}
