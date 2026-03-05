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

  const purpose = 'Rent & Sale';
  let title = `Properties for ${purpose} in Pakistan | Property Dealer`;
  let description = `Search and find properties for ${purpose.toLowerCase()} across Pakistan. Browse houses, apartments, plots and commercial properties on Property Dealer.`;

  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      if (cityData) {
        const typeName = type && type !== 'all' ? toTitleCase(type) : 'Properties';
        const formattedCity = toTitleCase(cityData.name);

        title = `${typeName} in ${formattedCity} | Property Dealer`;
        description = `Find the latest ${typeName.toLowerCase()} in ${formattedCity}. Browse real estate listings for ${purpose.toLowerCase()} in ${formattedCity}, Pakistan on Property Dealer.`;

        // If city has custom meta, use it if no type is selected
        if (type === 'all' || !type) {
          if (cityData.metaTitle) title = cityData.metaTitle;
          if (cityData.metaDescription) description = cityData.metaDescription;
        }
      }
    } catch (e) {
      const formattedCity = toTitleCase(cityName);
      title = `Properties in ${formattedCity} | Property Dealer`;
    }
  }

  return {
    title,
    description,
  };
}

export default async function AllRootPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cityName = (params.city as string) || '';

  let cityRichDescription = '';
  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      cityRichDescription = cityData?.description || '';
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
        purpose="all"
        useCleanUrls={true}
        city={cityName}
        richDescription={cityRichDescription}
      />
    </Suspense>
  );
}
