import Footer from "@/components/common/Footer";
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import MobileHero from "@/components/home/MobileHero";
import Partners from "@/components/home/Partners";
import Thesis from "@/components/home/Thesis";
import RecordNotResume from "@/components/home/RecordNotResume";
import WorkBehindGrowth from "@/components/home/WorkBehindGrowth";
import WorkResult from "@/components/home/WorkResult";
import { createPageMetadata } from "@/lib/seo";
import LogoDotSpreadCanvas from "@/components/home/canvasComponent/LogoDotSpreadCanvas";

const HomePage = () => {
  return (
    <>
      <Hero />
      <MobileHero />
      <About />
      <LogoDotSpreadCanvas colorBg="#0B1A2C" colorDots="#e3e2dc" />
      <WorkResult />
      <WorkBehindGrowth />
      <Partners />
      <Thesis />
      <RecordNotResume />
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default HomePage;

export async function generateMetadata() {
  return createPageMetadata("/");
}
