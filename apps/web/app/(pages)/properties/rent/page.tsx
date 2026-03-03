import PropertiesListing from '@/components/PropertiesListing';
import { serverApi } from '@/lib/server-api';
import { Metadata } from 'next';
import { Suspense } from 'react';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const cityName = (params.city as string) || '';
  const type = (params.type as string) || '';

  let title = 'Properties for Rent in Pakistan ';
  let description = 'Search and find houses, apartments and commercial properties for rent across Pakistan on Property Dealer.';

  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      if (cityData) {
        const typeName = type && type !== 'all' ? type.charAt(0).toUpperCase() + type.slice(1) : 'Properties';
        title = cityData.rentMetaTitle || `${typeName} for Rent in ${cityData.name}`;
        description = cityData.rentMetaDescription || `Find the best ${typeName.toLowerCase()} for rent in ${cityData.name}. Browse houses, flats, and more on Property Dealer.`;
      }
    } catch (e) {
      const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      title = `Properties for Rent in ${formattedCity} `;
    }
  }

  return {
    title,
    description,
  };
}

export default async function RentRootPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cityName = (params.city as string) || '';

  let cityRichDescription = '';
  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      cityRichDescription = cityData?.rentContent || '';
    } catch (e) {
      console.warn('Could not fetch city content for SEO:', e);
    }
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing
        purpose="rent"
        useCleanUrls={true}
        city={cityName}
        richDescription={cityRichDescription}
      />
    </Suspense>
  );
}
