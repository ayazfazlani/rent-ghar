import PropertiesListing from '@/components/PropertiesListing';

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export default async function SaleCityPage(props: PageProps) {
  const { city } = await props.params;
  
  return <PropertiesListing purpose="buy" city={city} useCleanUrls={true} />;
}
