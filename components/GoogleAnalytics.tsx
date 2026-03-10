// GA4 integration. Loads gtag.js and tracks pageviews on route changes.
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local to enable.
// Wrapped in Suspense because useSearchParams() requires it in App Router.
// Renders nothing if GA_MEASUREMENT_ID is not set or invalid (graceful opt-out).

"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/analytics";

// Validate format to prevent injection via dangerouslySetInnerHTML
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const isValidGaId = GA_MEASUREMENT_ID && GA_ID_PATTERN.test(GA_MEASUREMENT_ID);

function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isValidGaId) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!isValidGaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  );
}

