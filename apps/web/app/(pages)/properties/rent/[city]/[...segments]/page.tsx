import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { serverApi } from '@/lib/server-api';
import { toTitleCase } from '@/lib/utils';
import { buildItemListSchema, buildBreadcrumbSchema } from '@/lib/schema/listing-schema';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://rent-ghar.com';

interface PageProps {
  params: Promise<{
    city: string;
    segments: string[]; // catch-all: ['type'] | ['area'] | ['area', 'type']
  }>;
}

async function resolveSegments(citySlug: string, segments: string[]) {
  try {
    const cityData = await serverApi.getCityByName(citySlug);
    if (!cityData) return { cityData: null, areaData: null, propertyType: null, areaSlug: null };

    const propertyTypes = await serverApi.getTypes();

    if (segments.length === 1) {
      const seg = segments[0] as string;
      const matchedType = propertyTypes.find(t => t.toLowerCase() === seg.toLowerCase());

      if (matchedType) {
        return { cityData, areaData: null, propertyType: matchedType, areaSlug: null };
      }

      try {
        const areaData = await serverApi.getAreaBySlug(seg, cityData._id);
        return { cityData, areaData, propertyType: null, areaSlug: seg };
      } catch {
        return { cityData, areaData: null, propertyType: null, areaSlug: null };
      }
    }

    if (segments.length >= 2) {
      const areaSeg = segments[0] as string;
      const typeSeg = segments[1] as string;
      const matchedType = propertyTypes.find(t => t.toLowerCase() === typeSeg.toLowerCase()) || null;

      try {
        const areaData = await serverApi.getAreaBySlug(areaSeg, cityData._id);
        return { cityData, areaData, propertyType: matchedType, areaSlug: areaSeg };
      } catch {
        return { cityData, areaData: null, propertyType: matchedType, areaSlug: areaSeg };
      }
    }

    return { cityData, areaData: null, propertyType: null, areaSlug: null };
  } catch (error) {
    console.error('Error resolving segments:', error);
    return { cityData: null, areaData: null, propertyType: null, areaSlug: null };
  }
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: citySlug, segments } = await props.params;
  const { cityData, areaData, propertyType } = await resolveSegments(citySlug, segments);

  const purpose = 'Rent';
  const cityName = cityData ? toTitleCase(cityData.name) : toTitleCase(citySlug);

  if (areaData && propertyType) {
    const areaName = toTitleCase(areaData.name);
    const typeName = toTitleCase(propertyType);
    return {
      title: `${typeName} for ${purpose} in ${areaName}, ${cityName}`,
      description: `Find ${typeName.toLowerCase()} for ${purpose.toLowerCase()} in ${areaName}, ${cityName}. Browse verified listings on Property Dealer.`,
      alternates: { canonical: `/properties/rent/${citySlug}/${segments.join('/')}` },
    };
  }

  if (areaData) {
    const areaName = toTitleCase(areaData.name);
    return {
      title: areaData.metaTitle || `Properties for ${purpose} in ${areaName}, ${cityName}`,
      description: areaData.metaDescription || `Discover properties for ${purpose.toLowerCase()} in ${areaName}, ${cityName}. View photos, prices, and details on Property Dealer.`,
      alternates: { canonical: areaData.canonicalUrl || `/properties/rent/${citySlug}/${segments[0]}` },
    };
  }

  if (propertyType) {
    const typeName = toTitleCase(propertyType);
    const specificContent = cityData?.typeContents?.find(
      (tc: any) => tc.propertyType.toLowerCase() === propertyType.toLowerCase() && tc.purpose === 'rent'
    );
    return {
      title: specificContent?.metaTitle || `${typeName} for ${purpose} in ${cityName}`,
      description: specificContent?.metaDescription || `Find the best ${propertyType.toLowerCase()} for ${purpose.toLowerCase()} in ${cityName}. Browse verified listings on Property Dealer.`,
      alternates: { canonical: `/properties/rent/${citySlug}/${segments[0]}` },
    };
  }

  return { title: `Properties for ${purpose} in ${cityName}` };
}

export default async function RentCitySegmentsPage(props: PageProps) {
  const { city, segments } = await props.params;
  const { cityData, areaData, propertyType, areaSlug } = await resolveSegments(city, segments);

  if (!cityData) console.error(`City ${city} not found`);

  const listingType = propertyType || 'all';
  const areaId = areaData?._id;

  const specificContent = propertyType && !areaData && cityData?.typeContents?.find(
    (tc: any) => tc.propertyType.toLowerCase() === propertyType.toLowerCase() && tc.purpose === 'rent'
  );

  // Show rich content only when context is unambiguous:
  // - area-only page  → area description
  // - type-only page  → city typeContent for that type
  // - area+type page  → nothing (avoids showing generic area content under a type filter)
  const richDescription = areaData && propertyType
    ? undefined
    : areaData?.description || (specificContent as any)?.content || cityData?.rentContent;

  // --- Schema.org ---
  const cityName = cityData ? toTitleCase(cityData.name) : toTitleCase(city);
  const areaName = areaData ? toTitleCase(areaData.name) : null;
  const typeName = propertyType ? toTitleCase(propertyType) : null;
  const pageUrl = `${BASE_URL}/properties/rent/${city}/${segments.join('/')}`;
  const pageTitle = [
    typeName ? `${typeName}s` : 'Properties',
    'for Rent',
    areaName ? `in ${areaName}, ${cityName}` : `in ${cityName}`,
  ].join(' ');

  let schemaProperties: any[] = [];
  try {
    const params: Record<string, string> = { city, limit: '20', page: '1', purpose: 'rent' };
    if (areaId) params.areaId = areaId;
    if (listingType !== 'all') params.type = listingType;
    const qs = new URLSearchParams(params).toString();
    const res = await serverApi.getProperties(qs);
    const rawProps: any[] = Array.isArray(res) ? res : (res as any).properties || [];
    schemaProperties = rawProps.map((p: any) => ({
      id: p._id, slug: p.slug, name: p.title, type: p.propertyType,
      price: p.price, purpose: p.listingType,
      city: typeof p.area === 'object' ? p.area?.city?.name || city : city,
      location: p.location, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      area: p.areaSize, image: p.mainPhotoUrl, createdAt: p.createdAt,
    }));
  } catch { /* non-critical */ }

  const itemListSchema = buildItemListSchema(schemaProperties, pageUrl, pageTitle);
  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'Properties for Rent', url: `${BASE_URL}/properties/rent` },
    { name: cityName, url: `${BASE_URL}/properties/rent/${city}` },
    ...(areaName ? [{ name: areaName, url: `${BASE_URL}/properties/rent/${city}/${areaSlug}` }] : []),
    ...(typeName && areaName
      ? [{ name: `${typeName}s`, url: `${BASE_URL}/properties/rent/${city}/${areaSlug}/${segments[1]}` }]
      : typeName
        ? [{ name: `${typeName}s`, url: `${BASE_URL}/properties/rent/${city}/${segments[0]}` }]
        : []),
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <PropertiesListing
          purpose="rent"
          city={city}
          type={listingType}
          areaId={areaId}
          areaSlug={areaSlug || undefined}
          useCleanUrls={true}
          richDescription={richDescription}
        />
      </Suspense>
    </>
  );
}
