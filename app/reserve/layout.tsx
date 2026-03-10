import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reserve for $3 — 40% Off XForge Phone",
  description:
    "Lock in your 40% discount on the XForge Phone with a $3 refundable deposit. 100% money-back guarantee. Launching soon on Kickstarter.",
  openGraph: {
    title: "Reserve Your XForge Phone — 40% Off",
    description:
      "Lock in the lowest price ever with a $3 refundable deposit. Cancel anytime, no questions asked.",
    url: `${SITE_URL}/reserve`,
    images: [
      {
        url: "/placeholders/reserve-product.webp",
        width: 1200,
        height: 630,
        alt: "XForge Phone — Reserve at 40% Off",
      },
    ],
  },
  twitter: {
    title: "Reserve Your XForge Phone — 40% Off",
    description:
      "Lock in the lowest price ever with a $3 refundable deposit. Cancel anytime.",
    images: ["/placeholders/reserve-product.webp"],
  },
  alternates: {
    canonical: `${SITE_URL}/reserve`,
  },
};

export default function ReserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

