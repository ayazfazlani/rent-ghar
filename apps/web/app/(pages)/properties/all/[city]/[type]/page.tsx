import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { cityApi } from '@/lib/api/city/city.api';

interface PageProps {
  params: Promise<{
    city: string;
    type: string;
  }>;
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: citySlug, type } = await props.params;

  try {
    const cityData = await cityApi.getByName(citySlug);

    if (!cityData) return { title: `${type} for Rent & Sale in ${citySlug} | RENT-GHAR` };

    const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);

    return {
      title: cityData.metaTitle
        ? `${typeCapitalized} - ${cityData.metaTitle}`
        : `${typeCapitalized} for Rent & Sale in ${cityData.name} | RENT-GHAR`,
      description: cityData.metaDescription || `Find the best ${type} for rent and sale in ${cityData.name}. Browse latest listings.`,
      alternates: {
        canonical: cityData.canonicalUrl || undefined,
      },
    };
  } catch (error) {
    return {
      title: `${type} for Rent & Sale in ${citySlug} | RENT-GHAR`,
    };
  }
}

export default async function AllCityTypePage(props: PageProps) {
  const { city, type } = await props.params;
  let cityDetails = null;

  try {
    cityDetails = await cityApi.getByName(city);
  } catch (error) {
    console.error('Error fetching city details:', error);
  }

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[AllCityTypePage] Route params:', { city, type });
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing
        purpose="all"
        city={city}
        type={type}
        useCleanUrls={true}
        richDescription={cityDetails?.description}
      />
    </Suspense>
  );
}
