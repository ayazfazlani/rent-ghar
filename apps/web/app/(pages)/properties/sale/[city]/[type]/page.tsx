import PropertiesListing from '@/components/PropertiesListing';

interface PageProps {
  params: Promise<{
    city: string;
    type: string;
  }>;
}

export default async function SaleCityTypePage(props: PageProps) {
  const { city, type } = await props.params;
  
  return <PropertiesListing purpose="buy" city={city} type={type} useCleanUrls={true} />;
}
