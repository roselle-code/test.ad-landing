// Email subscription API. Syncs to Mailchimp (persistent store) and backs up
// to Cloudflare KV when the SUBSCRIBERS_KV binding is available.
// Requires: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID in env / .dev.vars
// Called by: Hero.tsx, EmailSubscription.tsx (MosaicGallery), Footer.tsx
// Rate limited by Cloudflare WAF rules (in-memory rate limiting doesn't work
// on Workers — each invocation is isolated and geographically distributed).

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { upsertContact, ensureMergeFieldsOnce } from "@/lib/mailchimp";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source?: string;
  userAgent?: string;
}

async function getKV(): Promise<KVNamespace | null> {
  try {
    const { env } = await getCloudflareContext();
    return (env as Record<string, unknown>).SUBSCRIBERS_KV as KVNamespace ?? null;
  } catch {
    return null;
  }
}

const VALID_SOURCES = ["hero", "how_it_works", "footer", "unknown"] as const;

function sanitizeSource(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const trimmed = raw.trim().toLowerCase().slice(0, 30);
  return (VALID_SOURCES as readonly string[]).includes(trimmed)
    ? trimmed
    : "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const { email, source } = (await req.json()) as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userAgent = req.headers.get("user-agent") || undefined;
    const validatedSource = sanitizeSource(source);

    // Back up to KV if the binding is available
    let isNew = true;
    const kv = await getKV();
    if (kv) {
      const existing = await kv.get(normalizedEmail);
      isNew = !existing;
      if (isNew) {
        const subscriber: Subscriber = {
          email: normalizedEmail,
          subscribedAt: new Date().toISOString(),
          source: validatedSource,
          userAgent,
        };
        await kv.put(normalizedEmail, JSON.stringify(subscriber));
      }
    }

    // Bootstrap Mailchimp merge fields once (cached in KV)
    await ensureMergeFieldsOnce(kv);

    // Mailchimp is the primary persistent store.
    // Uses PUT (upsert) — safe to call for existing contacts.
    try {
      await upsertContact({
        email: normalizedEmail,
        mergeFields: {
          SOURCE: validatedSource,
          ORIGIN: "self-hosted",
        },
        tags: ["xforge-landing"],
      });
    } catch {
      // Non-fatal — KV backup already has the email
      console.warn("[subscribe] Mailchimp upsert failed for", normalizedEmail);
    }

    return NextResponse.json({
      success: true,
      isNew,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "POST an email to subscribe. GET /api/subscribe/list with Authorization: Bearer <key> to list all.",
  });
}
