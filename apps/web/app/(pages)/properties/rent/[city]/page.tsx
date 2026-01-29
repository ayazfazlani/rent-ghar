import PropertiesListing from '@/components/PropertiesListing';

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export default async function RentCityPage(props: PageProps) {
  const { city } = await props.params;
  
  return <PropertiesListing purpose="rent" city={city} useCleanUrls={true} />;
}
