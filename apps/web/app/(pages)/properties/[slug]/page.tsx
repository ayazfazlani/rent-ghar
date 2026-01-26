import PropertyDetail from '@/components/PropertyDetail';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function PropertyDetailPage({ params }: PageProps) {
  return <PropertyDetail slug={params.slug} />;
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Property Details - ${params.slug}`,
    description: 'View property details',
  };
}
