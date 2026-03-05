import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';
import { toTitleCase } from '@/lib/utils';

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
    const cityData = await serverApi.getCityByName(citySlug);

    const purpose = 'Sale';
    if (!cityData) {
      return { title: `Properties for ${purpose} in ${toTitleCase(citySlug)} | Property Dealer` };
    }

    const cityName = toTitleCase(cityData.name);
    const title = cityData.saleMetaTitle || `Properties for ${purpose} in ${cityName} | Property Dealer`;
    const description = cityData.saleMetaDescription || `Find properties for ${purpose.toLowerCase()} in ${cityName}. Browse the latest houses, plots, and commercial listings on Property Dealer.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/properties/sale/${citySlug.toLowerCase()}`,
      },
    };
  } catch (error) {
    return {
      title: `Properties for Sale in ${toTitleCase(citySlug)} | Property Dealer`,
    };
  }
}

export default async function SaleCityPage(props: PageProps) {
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
        purpose="buy"
        city={city}
        useCleanUrls={true}
        richDescription={cityDetails?.saleContent}
      />
    </Suspense>
  );
}
