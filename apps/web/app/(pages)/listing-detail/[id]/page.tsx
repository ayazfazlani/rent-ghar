import PropertyDetail from '@/components/PropertyDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ListingDetailPage({ params }: PageProps) {
  return <PropertyDetail id={params.id} />;
}

// Optional: Metadata
export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Property Details - ${params.id}`,
    description: 'View property details'
  };
}