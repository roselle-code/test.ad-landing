// Shared across Hero, Footer, MosaicGallery email forms — keep in sync
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Single source of truth for the Kickstarter campaign URL.
// Used in: Footer, /reserve page, WhyReserve, any "Notify me" CTA.
export const KICKSTARTER_URL =
  "https://www.kickstarter.com/projects/xforgephone/xforge-the-phone-that-pays-it-forward";
