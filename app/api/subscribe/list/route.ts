// Admin-only endpoint to list subscribers from KV.
// Protected by Bearer token with constant-time comparison.
// Requires: ADMIN_API_KEY in env
// Usage: curl -H "Authorization: Bearer <key>" /api/subscribe/list

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
// Node.js crypto — requires "nodejs_compat" flag in wrangler.jsonc
import { timingSafeEqual } from "crypto";

/** Constant-time string comparison to prevent timing side-channel attacks. */
function safeTokenCompare(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return NextResponse.json(
      { error: "Admin access not configured" },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token || !safeTokenCompare(token, adminKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext();
    const kv = (env as Record<string, unknown>).SUBSCRIBERS_KV as KVNamespace | undefined;

    if (!kv) {
      return NextResponse.json({
        total: 0,
        subscribers: [],
        note: "SUBSCRIBERS_KV binding not configured",
      });
    }

    // Paginate through all KV keys (list() returns max 1000 per call)
    const allSubscribers: unknown[] = [];
    let cursor: string | undefined;

    do {
      const listResult = await kv.list({ cursor, limit: 1000 });

      const batch = await Promise.all(
        listResult.keys.map(async (key: { name: string }) => {
          const value = await kv.get(key.name);
          return value ? JSON.parse(value) : null;
        })
      );
      allSubscribers.push(...batch.filter(Boolean));

      cursor = listResult.list_complete ? undefined : (listResult.cursor as string);
    } while (cursor);

    return NextResponse.json({
      total: allSubscribers.length,
      subscribers: allSubscribers,
    });
  } catch {
    return NextResponse.json({ total: 0, subscribers: [] });
  }
}
