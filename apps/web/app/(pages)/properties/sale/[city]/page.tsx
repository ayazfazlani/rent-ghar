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
    const cityData = await serverApi.getCityByName(citySlug);

    if (!cityData) return { title: `Properties for Sale in ${citySlug} ` };

    return {
      title: cityData.saleMetaTitle || cityData.metaTitle || `Properties for Sale in ${cityData.name} `,
      description: cityData.saleMetaDescription || cityData.metaDescription || `Find properties for sale in ${cityData.name}. Best real estate listings in Pakistan on Property Dealer.`,
      alternates: {
        canonical: cityData.canonicalUrl || undefined,
      },
    };
  } catch (error) {
    return {
      title: `Properties for Sale in ${citySlug} `,
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
