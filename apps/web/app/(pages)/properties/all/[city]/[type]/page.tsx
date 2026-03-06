import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';
import { notFound } from 'next/navigation';
import { toTitleCase } from '@/lib/utils';

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
    return { title: `Properties in ${toTitleCase(citySlug)} | Property Dealer` };
  }

  const purpose = 'Rent & Sale';
  const cityName = toTitleCase(cityData.name);

  if (isPropertyType && propertyType) {
    const typeName = toTitleCase(propertyType);
    
    // Find specific content for this property type and purpose
    const specificContent = cityData.typeContents?.find(
      (tc: any) => tc.propertyType.toLowerCase() === propertyType.toLowerCase() && tc.purpose === 'all'
    );

    const title = specificContent?.metaTitle || `${typeName} for ${purpose} in ${cityName} | Property Dealer`;
    const description = specificContent?.metaDescription || `Find the best ${propertyType.toLowerCase()} for ${purpose.toLowerCase()} in ${cityName}. Browse the latest listings and verified properties on Property Dealer.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/properties/all/${citySlug.toLowerCase()}/${type.toLowerCase()}`,
      },
    };
  }

  if (areaData) {
    const areaName = toTitleCase(areaData.name);
    const title = `Properties for ${purpose} in ${areaName}, ${cityName} | Property Dealer`;
    const description = `Discover properties for ${purpose.toLowerCase()} in ${areaName}, ${cityName}. View photos, prices, and details of the latest listings on Property Dealer.`;

    return {
      title: areaData.metaTitle || title,
      description: areaData.metaDescription || description,
      alternates: {
        canonical: areaData.canonicalUrl || undefined,
      },
    };
  }

  return {
    title: `Properties in ${cityName} | Property Dealer`,
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

  const specificContent = isPropertyType && propertyType && cityData?.typeContents?.find(
    (tc: any) => tc.propertyType.toLowerCase() === propertyType.toLowerCase() && tc.purpose === 'all'
  );

  const richDescription = areaData?.description || specificContent?.content || cityData?.description;

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
        richDescription={richDescription}
      />
    </Suspense>
  );
}
