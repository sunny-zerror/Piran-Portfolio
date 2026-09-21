import AboutHero from "@/components/about/AboutHero";
import AboutStrength from "@/components/about/AboutStrength";
import AboutWork from "@/components/about/AboutWork";
import GallerySection from "@/components/about/GallerySection";
import ParallaxSection from "@/components/about/ParallaxSection";
import StorySection from "@/components/about/StorySection";
import AboutFooter from "@/components/common/AboutFooter";
import { createPageMetadata } from "@/lib/seo";

const AboutPage = () => {
  return (
    <>
      <AboutHero />
      <StorySection />
      <AboutStrength />
      {/* <ParallaxSection /> */}
      <GallerySection/>
      <footer>
        <AboutFooter />
      </footer>
    </>
  );
};

export default AboutPage;

export async function generateMetadata() {
  return createPageMetadata("/about");
}
