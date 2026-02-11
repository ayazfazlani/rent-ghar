import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export default async function RentCityPage(props: PageProps) {
  const { city } = await props.params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesListing purpose="rent" city={city} useCleanUrls={true} />
    </Suspense>
  );
}
