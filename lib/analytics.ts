// GA4 event tracking helpers. Event names are referenced in GA4 dashboards —
// renaming an action (e.g. "email_submit") will break existing reports.
// Requires NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local.

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function event({ action, category, label, value }: GTagEvent) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export const trackEmailSubmit = (source: string) =>
  event({
    action: "email_submit",
    category: "engagement",
    label: source,
  });

export const trackCtaClick = (label: string) =>
  event({
    action: "cta_click",
    category: "engagement",
    label,
  });

export const trackKickstarterClick = (source: string) =>
  event({
    action: "kickstarter_click",
    category: "conversion",
    label: source,
  });

export const trackReserveClick = () =>
  event({
    action: "reserve_click",
    category: "conversion",
    label: "stripe_checkout",
  });

export const trackScrollDepth = (section: string) =>
  event({
    action: "scroll_depth",
    category: "engagement",
    label: section,
  });
