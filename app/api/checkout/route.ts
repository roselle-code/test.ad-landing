// Stripe checkout redirect. Keeps the payment URL server-side so it's not
// exposed in client bundles. Set STRIPE_CHECKOUT_URL in .env.local.
// Called by: /reserve page "Reserve Discount for $3" button.

import { NextResponse } from "next/server";

export async function GET() {
  const checkoutUrl = process.env.STRIPE_CHECKOUT_URL;

  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "Checkout not configured" },
      { status: 503 }
    );
  }

  return NextResponse.redirect(checkoutUrl, 307);
}
