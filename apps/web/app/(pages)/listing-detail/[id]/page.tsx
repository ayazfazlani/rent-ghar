import PropertyDetail from '@/components/PropertyDetail';

export default function ListingDetailPage({ params }) {
  return <PropertyDetail propertyId={params.id} />;
}

// Optional: Metadata
export async function generateMetadata({ params }) {
  return {
    title: `Property Details - ${params.id}`,
    description: 'View property details'
  };
}