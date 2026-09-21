import { createPageMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import FAQ from "@/components/contact/FAQ";
import ThesisOverlay from "@/components/home/ThesisOverlay";
import HandParticlesCanvas from "@/components/contact/HandParticlesCanvas";

const ContactPage = () => {
  return (
    <>
      <ContactHero />
      <HandParticlesCanvas />
      <FAQ />
      <ThesisOverlay />
    </>
  );
};

export default ContactPage;

export async function generateMetadata() {
  return createPageMetadata("/contact");
}
