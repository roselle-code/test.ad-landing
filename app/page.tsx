import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import HowItWorks from "@/components/HowItWorks";
import WhyDifferent from "@/components/WhyDifferent";
import TechSpecs from "@/components/TechSpecs";
import WhyReserve from "@/components/WhyReserve";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "XForge Phone",
  description:
    "A premium smartphone that quietly contributes to a decentralized network while you use it, rewarding you with real perks every single day.",
  brand: { "@type": "Brand", name: "XForge" },
  image: "https://kickstarter.xforgephone.com/placeholders/reserve-product.png",
  url: "https://kickstarter.xforgephone.com",
  offers: {
    "@type": "Offer",
    price: "299",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
    url: "https://kickstarter.xforgephone.com/reserve",
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
        <HowItWorks />
        <WhyDifferent />
        <TechSpecs />
        <WhyReserve />
        <Footer />
      </main>
    </>
  );
}
