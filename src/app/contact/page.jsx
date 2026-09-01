import { createPageMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import FAQ from "@/components/contact/FAQ";
import ThesisOverlay from "@/components/home/ThesisOverlay";

const ContactPage = () => {
  return (
    <>
      <ContactHero />
      <FAQ />
      <ThesisOverlay />
    </>
  );
};

export default ContactPage;

export async function generateMetadata() {
  return createPageMetadata("/contact");
}
