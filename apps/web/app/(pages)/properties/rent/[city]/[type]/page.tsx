import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    city: string;
    type: string;
  }>;
}

export default async function RentCityTypePage(props: PageProps) {
  const { city, type } = await props.params;

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[RentCityTypePage] Route params:', { city, type });
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing purpose="rent" city={city} type={type} useCleanUrls={true} />
    </Suspense>
  );
}
