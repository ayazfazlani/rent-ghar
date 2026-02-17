import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: citySlug } = await props.params;

  try {
    // Attempt to fetch city data by name (slug)
    const cityData = await serverApi.getCityByName(citySlug);

    if (!cityData) return { title: `Properties in ${citySlug} | RENT-GHAR` };

    return {
      title: cityData.metaTitle || `Properties for Rent in ${cityData.name} | RENT-GHAR`,
      description: cityData.metaDescription || `Find the best properties for rent in ${cityData.name}. Browse houses, flats, and more.`,
      alternates: {
        canonical: cityData.canonicalUrl || undefined,
      },
    };
  } catch (error) {
    return {
      title: `Properties for Rent in ${citySlug} | RENT-GHAR`,
    };
  }
}

export default async function RentCityPage(props: PageProps) {
  const { city } = await props.params;
  let cityDetails = null;

  try {
    cityDetails = await serverApi.getCityByName(city);
  } catch (error) {
    console.error('Error fetching city details:', error);
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing
        purpose="rent"
        city={city}
        useCleanUrls={true}
        richDescription={cityDetails?.description}
      />
    </Suspense>
  );
}
