import type { Metadata, Viewport } from "next";
import { Inter_Tight, IBM_Plex_Serif, Space_Grotesk } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

// UPDATE HERE when domain changes — affects canonical URL, OG tags, and sitemap
const SITE_URL = "https://kickstarter.xforgephone.com";
const SITE_NAME = "XForge Phone";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "XForge Phone — The Phone that Pays You Back",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Your premium phone quietly contributes to a decentralized network while you use it, rewarding you with real perks, every single day.",
  keywords: [
    "XForge",
    "XForge Phone",
    "smartphone",
    "decentralized",
    "DePIN",
    "crypto phone",
    "passive income phone",
    "earn rewards",
    "blockchain phone",
    "Kickstarter phone",
    "Web3 phone",
    "mining phone",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "XForge Phone — The Phone that Pays You Back",
    description:
      "A premium smartphone that earns you real rewards every day through decentralized network participation. Reserve yours at 40% off.",
    images: [
      {
        url: "/placeholders/reserve-product.png",
        width: 1200,
        height: 630,
        alt: "XForge Phone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XForge Phone — The Phone that Pays You Back",
    description:
      "A premium smartphone that earns you real rewards every day. Reserve at 40% off on Kickstarter.",
    images: ["/placeholders/reserve-product.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${interTight.variable} ${ibmPlexSerif.variable} ${spaceGrotesk.variable} antialiased font-sans`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
