'use client'
import PropertyDetail from '@/components/PropertyDetail';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  if (!id) {
    return <div>Property ID not found</div>;
  }
  
  return <PropertyDetail id={id} />;
}
