// Email subscription API. Saves to local JSON (ephemeral on Vercel) and syncs to Mailchimp.
// Requires: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID in .env.local
// Called by: Hero.tsx, EmailSubscription.tsx (MosaicGallery), Footer.tsx
// Rate limited by IP (in-memory). See lib/rate-limit.ts for limits.

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimit } from "@/lib/rate-limit";

// WARNING: On Vercel serverless, filesystem writes are ephemeral (lost on redeploy).
// Mailchimp is the persistent store. This JSON is a local dev convenience + fallback.
const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
  source?: string;
  userAgent?: string;
}

function readSubscribers(): Subscriber[] {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSubscribers(subscribers: Subscriber[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(subscribers, null, 2));
}

async function addToMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) return { skipped: true };

  const dc = apiKey.split("-").pop();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `apikey ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      tags: ["xforge-landing"],
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    if (body.title === "Member Exists") return { exists: true };
    throw new Error(body.detail || "Mailchimp error");
  }

  return { success: true };
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
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { allowed, remaining } = rateLimit(ip, {
      maxRequests: 5,
      windowMs: 60_000,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
        }
      );
    }

    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const { email, source } = await req.json();
    void remaining;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userAgent = req.headers.get("user-agent") || undefined;
    const validatedSource = sanitizeSource(source);

    const subscribers = readSubscribers();
    const alreadyExists = subscribers.some(
      (s) => s.email === normalizedEmail
    );

    if (!alreadyExists) {
      subscribers.push({
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
        source: validatedSource,
        userAgent,
      });
      writeSubscribers(subscribers);
    }

    let mailchimpResult: Record<string, unknown> = {};
    try {
      mailchimpResult = await addToMailchimp(normalizedEmail);
    } catch {
      mailchimpResult = { error: "mailchimp_unavailable" };
    }

    return NextResponse.json({
      success: true,
      isNew: !alreadyExists,
      mailchimp: mailchimpResult,
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
