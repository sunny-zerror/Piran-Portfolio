import AboutHero from "@/components/about/AboutHero";
import ParallaxSection from "@/components/about/ParallaxSection";
import StorySection from "@/components/about/StorySection";
import { createPageMetadata } from "@/lib/seo";

const AboutPage = () => {
  return (
    <>
      <AboutHero/>
      <StorySection/>
      <ParallaxSection/>
    </>
  );
};

export default AboutPage;

export async function generateMetadata() {
  return createPageMetadata("/about");
}
