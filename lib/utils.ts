// Shared across Hero, Footer, MosaicGallery email forms — keep in sync
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Single source of truth — update here when domain changes.
// Used in: layout.tsx, page.tsx (JSON-LD), sitemap.ts, robots.ts
export const SITE_URL = "https://pre-xforge-ks-landing-nh4h.vercel.app";

// Single source of truth for the Kickstarter campaign URL.
// Used in: Footer, /reserve page, WhyReserve, any "Notify me" CTA.
export const KICKSTARTER_URL =
  "https://www.kickstarter.com/projects/xforgephone/xforge-the-phone-that-pays-it-forward";
