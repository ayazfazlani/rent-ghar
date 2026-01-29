import PropertiesListing from '@/components/PropertiesListing';

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
  
  return <PropertiesListing purpose="rent" city={city} type={type} useCleanUrls={true} />;
}
