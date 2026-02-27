import PropertyDetail from '@/components/PropertyDetail';
import { serverApi } from '@/lib/server-api';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const property = await serverApi.getPropertyBySlug(slug);

    if (!property) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
      };
    }

    const title = `${property.title}`;
    const description = property.description?.substring(0, 160) || `View details for property: ${property.title}`;
    const imageUrl = property.mainPhotoUrl || '/og-image.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/properties/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for property:', error);
    return {
      title: 'Property Details',
      description: 'View property details on PropertyDealer',
    };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let property = null;
  try {
    property = await serverApi.getPropertyBySlug(slug);
  } catch (error) {
    console.error('Error fetching property for page:', error);
  }

  return <PropertyDetail slug={slug} initialProperty={property} />;
}
