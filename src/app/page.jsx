import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import MobileHero from "@/components/home/MobileHero";
import Partners from "@/components/home/Partners";
import RecordNotResume from "@/components/home/RecordNotResume";
import WorkBehindGrowth from "@/components/home/WorkBehindGrowth";
import WorkResult from "@/components/home/WorkResult";
import { createPageMetadata } from "@/lib/seo";

const HomePage = () => {
  return (
    <>
    <Hero />
    <MobileHero/>
    <About/>
    <WorkResult/>
    <WorkBehindGrowth/>
    <Partners/>
    <RecordNotResume/>
    </>
  );
};

export default HomePage;

export async function generateMetadata() {
  return createPageMetadata("/");
}
