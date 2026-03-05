import PropertiesListing from '@/components/PropertiesListing';
import { serverApi } from '@/lib/server-api';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { toTitleCase } from '@/lib/utils';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const cityName = (params.city as string) || '';
  const type = (params.type as string) || '';

  const purpose = 'Sale';
  let title = `Properties for ${purpose} in Pakistan | Property Dealer`;
  let description = `Find your dream home with Property Dealer. Browse thousands of houses, plots, and commercial properties for ${purpose.toLowerCase()} in Pakistan.`;

  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      if (cityData) {
        const typeName = type && type !== 'all' ? toTitleCase(type) : 'Properties';
        const formattedCity = toTitleCase(cityData.name);

        title = `${typeName} for ${purpose} in ${formattedCity} | Property Dealer`;
        description = `Find the best ${typeName.toLowerCase()} for ${purpose.toLowerCase()} in ${formattedCity}. Browse the latest listings and verified properties on Property Dealer.`;

        // If city has custom meta, use it if no type is selected
        if (type === 'all' || !type) {
          if (cityData.saleMetaTitle) title = cityData.saleMetaTitle;
          if (cityData.saleMetaDescription) description = cityData.saleMetaDescription;
        }
      }
    } catch (e) {
      const formattedCity = toTitleCase(cityName);
      title = `Properties for ${purpose} in ${formattedCity} | Property Dealer`;
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
