// Admin-only endpoint to list subscribers. Protected by Bearer token.
// Requires: ADMIN_API_KEY in .env.local
// Usage: curl -H "Authorization: Bearer <key>" /api/subscribe/list

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

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

  if (!token || token !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const subscribers = JSON.parse(raw);
    return NextResponse.json({
      total: subscribers.length,
      subscribers,
    });
  } catch {
    return NextResponse.json({ total: 0, subscribers: [] });
  }
}
