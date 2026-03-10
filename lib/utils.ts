// Shared across Hero, Footer, MosaicGallery email forms — keep in sync
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Single source of truth — set NEXT_PUBLIC_SITE_URL in env or update the fallback.
// Used in: layout.tsx, page.tsx (JSON-LD), sitemap.ts, robots.ts, reserve/layout.tsx
// Validated with URL.canParse() so placeholder values (e.g. "CHANGE_ME") don't
// crash the build when layout.tsx does `new URL(SITE_URL)`.
const DEFAULT_SITE_URL = "https://kickstarter.xforgephone.com";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const SITE_URL =
  envUrl && URL.canParse(envUrl) ? envUrl : DEFAULT_SITE_URL;

// Single source of truth for the Kickstarter campaign URL.
// Used in: Footer, /reserve page, WhyReserve, any "Notify me" CTA.
export const KICKSTARTER_URL =
  "https://www.kickstarter.com/projects/xforgephone/xforge-the-phone-that-pays-it-forward";
