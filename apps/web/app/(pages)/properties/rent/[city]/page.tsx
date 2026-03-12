import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';
import { toTitleCase } from '@/lib/utils';
import { buildCollectionPageSchema } from '@/lib/schema/listing-schema';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertydealer.pk';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: citySlug } = await props.params;
  try {
    const cityData = await serverApi.getCityByName(citySlug);
    const purpose = 'Rent';
    if (!cityData) return { title: `Properties for ${purpose} in ${toTitleCase(citySlug)}` };
    const cityName = toTitleCase(cityData.name);
    return {
      title: cityData.rentMetaTitle || `Properties for ${purpose} in ${cityName}`,
      description: cityData.rentMetaDescription || `Find the best properties for ${purpose.toLowerCase()} in ${cityName}. Browse the latest houses, flats, and more on Property Dealer.`,
      alternates: { canonical: `/properties/rent/${citySlug.toLowerCase()}` },
    };
  } catch {
    return { title: `Properties for Rent in ${toTitleCase(citySlug)}` };
  }
}

export default async function RentCityPage(props: PageProps) {
  const { city } = await props.params;
  let cityDetails: any = null;

  try {
    cityDetails = await serverApi.getCityByName(city);
  } catch (error) {
    console.error('Error fetching city details:', error);
  }

  const cityName = cityDetails ? toTitleCase(cityDetails.name) : toTitleCase(city);
  const pageUrl = `${BASE_URL}/properties/rent/${city}`;
  const pageTitle = cityDetails?.rentMetaTitle || `Properties for Rent in ${cityName}`;

  let schemaProperties: any[] = [];
  try {
    const res = await serverApi.getProperties(`city=${city}&purpose=rent&limit=20&page=1`);
    const rawProps: any[] = Array.isArray(res) ? res : (res as any).properties || [];
    schemaProperties = rawProps.map((p: any) => ({
      id: p._id, slug: p.slug, name: p.title, type: p.propertyType,
      price: p.price, purpose: p.listingType,
      city: typeof p.area === 'object' ? p.area?.city?.name || city : city,
      location: p.location, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      area: p.areaSize, image: p.mainPhotoUrl, createdAt: p.createdAt,
    }));
  } catch { /* non-critical */ }

  const collectionSchema = buildCollectionPageSchema({
    url: pageUrl,
    title: pageTitle,
    cityName,
    properties: schemaProperties.map(p => ({
      title: p.name,
      url: `${BASE_URL}/p/${p.slug || p.id}`
    })),
    totalItems: schemaProperties.length,
    crumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Properties for Rent', url: `${BASE_URL}/properties/rent` },
      { name: cityName, url: pageUrl },
    ]
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <PropertiesListing
          purpose="rent"
          city={city}
          useCleanUrls={true}
          richDescription={cityDetails?.rentContent}
        />
      </Suspense>
    </>
  );
}
