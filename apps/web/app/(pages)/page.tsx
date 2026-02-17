import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import TestimonialSection from "@/components/TestimonialSection";
import BlogSection from "@/components/BlogSection";
import ExploreTools from "@/components/ExploreTools";
import AboutBrief from "@/components/AboutBrief";
import PopularLocations from "@/components/PopularLocations";
import WhyChooseUs from "@/components/WhyChooseUs";
import AgentSignupSection from "@/components/AgentSignupSection";
import FAQSection from "@/components/FAQSection";
import { serverApi } from "@/lib/server-api";
import { mapBackendToFrontendProperty } from "@/lib/types/property-utils";
import { transformBlogsToPosts } from "@/lib/utils/blog-utils";

// Home Page - Server Component
// =============================
export default async function Home() {
  try {
    // 1. Fetch data on the server with Next.js caching
    const [citiesData, propertiesData, typesData, blogsData] = await Promise.all([
      serverApi.getCities(),
      serverApi.getProperties('limit=8'),
      serverApi.getTypes(),
      serverApi.getPublishedBlogs(),
    ]);

    // 2. Pre-process Cities for PopularLocations
    const cityToSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const DEFAULT_CITY_IMAGES: Record<string, string> = {
      'karachi': 'https://images.unsplash.com/photo-1570533113000-67623306634d?w=800&q=80',
      'lahore': 'https://images.unsplash.com/photo-1596422846543-75c6fc18a5ce?w=800&q=80',
      'islamabad': 'https://images.unsplash.com/photo-1621538356947-f495bf847683?w=800&q=80',
      'rawalpindi': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'faisalabad': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'peshawar': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    };
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80';

    const processedCities = await Promise.all(
      citiesData.slice(0, 6).map(async (city: any) => {
        try {
          const stats = await serverApi.getLocationStats(city.name);
          return {
            ...city,
            count: stats.total || 0,
            slug: cityToSlug(city.name),
            image: city.thumbnail || DEFAULT_CITY_IMAGES[city.name.toLowerCase()] || FALLBACK_IMAGE
          };
        } catch (err) {
          return {
            ...city,
            count: 0,
            slug: cityToSlug(city.name),
            image: city.thumbnail || DEFAULT_CITY_IMAGES[city.name.toLowerCase()] || FALLBACK_IMAGE
          };
        }
      })
    );
    processedCities.sort((a, b) => b.count - a.count);

    // 3. Pre-process Properties for FeaturedSection and Hero suggestions
    const backendProperties = Array.isArray(propertiesData) ? propertiesData : (propertiesData as any).properties || [];
    const transformedProperties = backendProperties.map(mapBackendToFrontendProperty);

    const featuredProperties = transformedProperties.map((property: any) => ({
      id: property.id,
      image: property.image,
      title: property.name,
      location: `${property.location}, ${property.city}`,
      price: `Rs. ${property.price.toLocaleString('en-PK')}`,
      priceLabel: property.purpose === 'buy' ? 'Total Price' : 'Monthly Rent',
      beds: property.bedrooms,
      baths: property.bathrooms,
      area: `${property.area} sq ft`,
      slug: property.slug,
    }));

    // 4. Pre-process Types for HeroSection
    const processedTypes = typesData.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)).sort();

    // 5. Pre-process Blogs for BlogSection
    const processedBlogs = transformBlogsToPosts(blogsData).slice(0, 6);

    return (
      <>
        <HeroSection
          initialCities={citiesData.map((c: any) => ({ _id: c._id, name: c.name })).sort((a: any, b: any) => a.name.localeCompare(b.name))}
          initialProperties={transformedProperties}
          initialTypes={processedTypes}
        />
        <PopularLocations initialCities={processedCities} />
        <FeaturedSection initialProperties={featuredProperties} />
        <WhyChooseUs />
        <AgentSignupSection />
        <ExploreTools />
        <TestimonialSection />
        <BlogSection initialPosts={processedBlogs} />
        <FAQSection />

      </>
    );
  } catch (error) {
    console.error('💥 Homepage Server Rendering Failed:', error);
    // Graceful fallback to client-side components if server fetching fails
    return (
      <>
        <HeroSection />
        <PopularLocations />
        <FeaturedSection />
        <WhyChooseUs />
        <AgentSignupSection />
        <ExploreTools />
        <TestimonialSection />
        <BlogSection />
        <FAQSection />
      </>
    );
  }
}
