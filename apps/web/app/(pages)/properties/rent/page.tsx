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

  const purpose = 'Rent';
  let title = `Properties for ${purpose} in Pakistan `;
  let description = `Search and find houses, apartments and commercial properties for ${purpose.toLowerCase()} across Pakistan on Property Dealer.`;

  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      if (cityData) {
        const typeName = type && type !== 'all' ? toTitleCase(type) : 'Properties';
        const formattedCity = toTitleCase(cityData.name);

        title = `${typeName} for ${purpose} in ${formattedCity} `;
        description = `Find the best ${typeName.toLowerCase()} for ${purpose.toLowerCase()} in ${formattedCity}. Browse the latest listings and verified properties on Property Dealer.`;

        // If city has custom meta, use it if no type is selected
        if (type === 'all' || !type) {
          if (cityData.rentMetaTitle) title = cityData.rentMetaTitle;
          if (cityData.rentMetaDescription) description = cityData.rentMetaDescription;
        } else {
          // Check for specific property type content
          const specificContent = cityData.typeContents?.find(
            (tc: any) => tc.propertyType.toLowerCase() === type.toLowerCase() && tc.purpose === 'rent'
          );
          if (specificContent?.metaTitle) title = specificContent.metaTitle;
          if (specificContent?.metaDescription) description = specificContent.metaDescription;
        }
      }
    } catch (e) {
      const formattedCity = toTitleCase(cityName);
      title = `Properties for ${purpose} in ${formattedCity} `;
    }
  }

  let path = `/properties/rent`;
  if (cityName) {
    path += `/${cityName.toLowerCase()}`;
    if (type && type !== 'all') {
      path += `/${type.toLowerCase()}`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
  };
}

export default async function RentRootPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cityName = (params.city as string) || '';

  let cityRichDescription = '';
  if (cityName) {
    try {
      const cityData = await serverApi.getCityByName(cityName);
      const type = (params.type as string) || '';
      
      const specificContent = type && type !== 'all' && cityData?.typeContents?.find(
        (tc: any) => tc.propertyType.toLowerCase() === type.toLowerCase() && tc.purpose === 'rent'
      );

      cityRichDescription = specificContent?.content || cityData?.rentContent || '';
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
