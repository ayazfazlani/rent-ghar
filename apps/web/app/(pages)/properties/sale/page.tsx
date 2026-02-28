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

  let title = 'Properties for Sale in Pakistan ';
  let description = 'Find your dream home with Property Dealer. Browse thousands of houses, plots, and commercial properties for sale in Pakistan.';

  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      if (cityData) {
        title = cityData.metaTitle ? `For Sale: ${cityData.metaTitle}` : `${type && type !== 'all' ? type.charAt(0).toUpperCase() + type.slice(1) : 'Properties'} for Sale in ${cityData.name} `;
        description = cityData.metaDescription || `Explore the best properties for sale in ${cityData.name}. Find houses, apartments, and plots on Property Dealer.`;
      }
    } catch (e) {
      const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      title = `Properties for Sale in ${formattedCity} `;
    }
  }

  return {
    title,
    description,
  };
}

export default async function SaleRootPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cityName = (params.city as string) || '';

  let cityRichDescription = '';
  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      cityRichDescription = cityData?.saleContent || '';
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
        purpose="buy"
        useCleanUrls={true}
        city={cityName}
        richDescription={cityRichDescription}
      />
    </Suspense>
  );
}
