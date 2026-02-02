import HeroSection from "@/components/HeroSection";
 import FeaturedSection from "@/components/FeaturedSection";
 import TestimonialSection from "@/components/TestimonialSection";
 import BlogSection from "@/components/BlogSection";
 import ExploreTools from "@/components/ExploreTools";
import CityProperties from "@/components/CityProperties";
import AnimatedCTABar from "@/components/Animatedctabar";
 
export default  function Home() {
 
  return (
    <>
   
       <HeroSection />
      <FeaturedSection />
       <CityProperties />
       <ExploreTools />
       <TestimonialSection />
             <BlogSection />
             <AnimatedCTABar />

      
    </>
  );
}