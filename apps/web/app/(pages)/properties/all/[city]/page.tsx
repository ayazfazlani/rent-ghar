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
    const purpose = 'Rent & Sale';
    if (!cityData) return { title: `Properties in ${toTitleCase(citySlug)}` };
    const cityName = toTitleCase(cityData.name);
    return {
      title: cityData.metaTitle || `Properties for ${purpose} in ${cityName}`,
      description: cityData.metaDescription || `Explore all properties for ${purpose.toLowerCase()} in ${cityName}. Find your dream home with Property Dealer.`,
      alternates: { canonical: `/properties/all/${citySlug.toLowerCase()}` },
    };
  } catch {
    return { title: `Properties in ${toTitleCase(citySlug)}` };
  }
}

export default async function AllCityPage(props: PageProps) {
  const { city } = await props.params;
  let cityDetails: any = null;

  try {
    cityDetails = await serverApi.getCityByName(city);
  } catch (error) {
    console.error('Error fetching city details:', error);
  }

  const cityName = cityDetails ? toTitleCase(cityDetails.name) : toTitleCase(city);
  const pageUrl = `${BASE_URL}/properties/all/${city}`;
  const pageTitle = cityDetails?.metaTitle || `Properties for Rent & Sale in ${cityName}`;

  // Fetch top properties for schema
  let schemaProperties: any[] = [];
  try {
    const res = await serverApi.getProperties(`city=${city}&limit=20&page=1`);
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
      { name: 'Properties', url: `${BASE_URL}/properties/all` },
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
          purpose="all"
          city={city}
          useCleanUrls={true}
          richDescription={cityDetails?.description}
        />
      </Suspense>
    </>
  );
}
