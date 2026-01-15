 import PropertyDetail from '@/components/PropertyDetail';

export default function PropertyDetailPage() {
  return <PropertyDetail />;
}

// Optional: Better SEO ke liye
export async function generateStaticParams() {
  const { properties } = await import('@/lib/data');
  return properties.map((property) => ({
    id: property.id,
  }));
}