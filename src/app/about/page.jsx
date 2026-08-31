import AboutHero from "@/components/about/AboutHero";
import AboutStrength from "@/components/about/AboutStrength";
import AboutWork from "@/components/about/AboutWork";
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
      <ParallaxSection />
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
