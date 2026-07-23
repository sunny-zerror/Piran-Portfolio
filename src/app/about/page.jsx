import AboutHero from "@/components/about/AboutHero";
import AboutStrength from "@/components/about/AboutStrength";
import AboutWork from "@/components/about/AboutWork";
import ParallaxSection from "@/components/about/ParallaxSection";
import StorySection from "@/components/about/StorySection";
import { createPageMetadata } from "@/lib/seo";

const AboutPage = () => {
  return (
    <>
      <AboutHero/>
      <StorySection/>
      <AboutWork/>
      <AboutStrength/>
      <ParallaxSection/>
    </>
  );
};

export default AboutPage;

export async function generateMetadata() {
  return createPageMetadata("/about");
}
