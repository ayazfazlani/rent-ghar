import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import TestimonialSection from "@/components/TestimonialSection";
import BlogSection from "@/components/BlogSection";
import ExploreTools from "@/components/ExploreTools";


export default function Home() {

  return (
    <>

      <HeroSection />
      <div className="container mx-auto px-4 mt-8">
      </div>
      <FeaturedSection />
      <BlogSection />
      <ExploreTools />
      <TestimonialSection />

    </>
  );
}