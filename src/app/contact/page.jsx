import { createPageMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import FAQ from "@/components/contact/FAQ";

const ContactPage = () => {
  return (
    <>
      <ContactHero />
      <FAQ />
    </>
  );
};

export default ContactPage;

export async function generateMetadata() {
  return createPageMetadata("/contact");
}
