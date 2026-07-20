import AboutHero from "@/components/about/AboutHero";
import ParallaxSection from "@/components/about/ParallaxSection";
import { createPageMetadata } from "@/lib/seo";

const AboutPage = () => {
  return (
    <>
      <AboutHero/>
      <ParallaxSection/>
    </>
  );
};

export default AboutPage;

export async function generateMetadata() {
  return createPageMetadata("/about");
}
