import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import MosaicGallery from "@/components/MosaicGallery";
import WhyDifferent from "@/components/WhyDifferent";
import TechSpecs from "@/components/TechSpecs";
import WhyReserve from "@/components/WhyReserve";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/utils";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "XForge Phone",
  description:
    "XForge is a premium Android smartphone powered by on-device AI built to reward you.",
  brand: { "@type": "Brand", name: "XForge" },
  image: `${SITE_URL}/placeholders/reserve-product.webp`,
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "299",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
    url: `${SITE_URL}/reserve`,
    priceValidUntil: "2027-12-31",
  },
  aggregateRating: undefined,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <Partners />
        <MosaicGallery />
        <WhyDifferent />
        <TechSpecs />
        <WhyReserve />
        <Footer />
      </main>
    </>
  );
}
