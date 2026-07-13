import About from "@/components/home/About";
import Build3 from "@/components/home/Build3";
import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import RecordNotResume from "@/components/home/RecordNotResume";
import WorkBehindGrowth from "@/components/home/WorkBehindGrowth";
import WorkResult from "@/components/home/WorkResult";
import { createPageMetadata } from "@/lib/seo";

const HomePage = () => {
  return (
    <>
    <Hero />
    <About/>
    <WorkResult/>
    <WorkBehindGrowth/>
    <Partners/>
    <Build3/>
    <RecordNotResume/>
    </>
  );
};

export default HomePage;

export async function generateMetadata() {
  return createPageMetadata("/");
}
