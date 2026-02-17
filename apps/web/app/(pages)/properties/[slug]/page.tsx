import PropertyDetail from '@/components/PropertyDetail';

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <PropertyDetail slug={slug} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `Property Details - ${slug}`,
    description: 'View property details',
  };
}
