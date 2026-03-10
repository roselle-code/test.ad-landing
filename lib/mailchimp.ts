// Mailchimp Marketing API helper.
// Requires: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID in env / .dev.vars
//
// Merge fields (custom contact properties):
//   - RESV_AMT  (number) — reservation amount in USD
//   - SOURCE    (text)   — signup source (hero, footer, etc.)
//   - ORIGIN    (text)   — deployment origin (e.g. "self-hosted")
// These must be created once in the Mailchimp audience. See ensureMergeFields().

// Node.js crypto — requires the "nodejs_compat" flag in wrangler.jsonc.
// Web Crypto (crypto.subtle) does NOT support MD5, so this is intentional.
import { createHash } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MailchimpConfig {
  apiKey: string;
  listId: string;
  dc: string; // data-center prefix, e.g. "us1"
}

interface MailchimpMemberResponse {
  id: string;
  email_address: string;
  status: string;
  merge_fields?: Record<string, unknown>;
  tags?: Array<{ id: number; name: string }>;
}

interface MailchimpErrorResponse {
  title?: string;
  detail?: string;
  status?: number;
}

export interface UpsertContactOptions {
  email: string;
  status?: "subscribed" | "pending" | "unsubscribed" | "cleaned";
  mergeFields?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateContactOptions {
  email: string;
  mergeFields?: Record<string, unknown>;
}

export interface MailchimpResult {
  success?: boolean;
  exists?: boolean;
  skipped?: boolean;
  error?: string;
  member?: MailchimpMemberResponse;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getConfig(): MailchimpConfig | null {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) return null;
  const dc = apiKey.split("-").pop()!;
  return { apiKey, listId, dc };
}

function baseUrl(dc: string): string {
  return `https://${dc}.api.mailchimp.com/3.0`;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `apikey ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/** Mailchimp identifies members by the MD5 hash of the lowercase email. */
export function subscriberHash(email: string): string {
  return createHash("md5").update(email.toLowerCase().trim()).digest("hex");
}

// ─── Subscribe / upsert a contact ───────────────────────────────────────────

/**
 * Add or update a contact (upsert). Uses PUT /lists/{id}/members/{hash}.
 * If the contact already exists, their merge fields & status are updated.
 * If new, they are created with the given status (default: "subscribed").
 */
export async function upsertContact(opts: UpsertContactOptions): Promise<MailchimpResult> {
  const cfg = getConfig();
  if (!cfg) return { skipped: true };

  const hash = subscriberHash(opts.email);
  const url = `${baseUrl(cfg.dc)}/lists/${cfg.listId}/members/${hash}?skip_merge_validation=true`;

  const body: Record<string, unknown> = {
    email_address: opts.email.toLowerCase().trim(),
    status_if_new: opts.status ?? "subscribed",
  };

  if (opts.mergeFields && Object.keys(opts.mergeFields).length > 0) {
    body.merge_fields = opts.mergeFields;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: authHeaders(cfg.apiKey),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json()) as MailchimpErrorResponse;
    throw new Error(err.detail || `Mailchimp error (HTTP ${res.status})`);
  }

  const member = (await res.json()) as MailchimpMemberResponse;

  // Apply tags separately (PUT /members doesn't accept tags directly)
  if (opts.tags?.length) {
    await setTags(cfg, opts.email, opts.tags);
  }

  return { success: true, member };
}

// ─── Update a contact's merge fields ────────────────────────────────────────

/**
 * Patch an existing contact's merge fields. Useful for updating
 * reservation_amount after a Stripe checkout, for example.
 *
 * PATCH /lists/{list_id}/members/{subscriber_hash}
 */
export async function updateContactMergeFields(opts: UpdateContactOptions): Promise<MailchimpResult> {
  const cfg = getConfig();
  if (!cfg) return { skipped: true };

  const hash = subscriberHash(opts.email);
  const url = `${baseUrl(cfg.dc)}/lists/${cfg.listId}/members/${hash}?skip_merge_validation=true`;

  const body: Record<string, unknown> = {};
  if (opts.mergeFields && Object.keys(opts.mergeFields).length > 0) {
    body.merge_fields = opts.mergeFields;
  }

  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(cfg.apiKey),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json()) as MailchimpErrorResponse;
    throw new Error(err.detail || `Mailchimp error (HTTP ${res.status})`);
  }

  const member = (await res.json()) as MailchimpMemberResponse;
  return { success: true, member };
}

// ─── Tags ────────────────────────────────────────────────────────────────────

/**
 * Add tags to a contact.
 * POST /lists/{list_id}/members/{subscriber_hash}/tags
 */
async function setTags(cfg: MailchimpConfig, email: string, tags: string[]): Promise<void> {
  const hash = subscriberHash(email);
  const url = `${baseUrl(cfg.dc)}/lists/${cfg.listId}/members/${hash}/tags`;

  await fetch(url, {
    method: "POST",
    headers: authHeaders(cfg.apiKey),
    body: JSON.stringify({
      tags: tags.map((name) => ({ name, status: "active" })),
    }),
  });
}

// ─── Merge-field bootstrapping (run once) ────────────────────────────────────

/** Desired merge fields — add new entries here and the KV cache auto-invalidates. */
const DESIRED_MERGE_FIELDS = [
  { tag: "RESV_AMT", name: "Reservation Amount", type: "number" },
  { tag: "SOURCE", name: "Signup Source", type: "text" },
  { tag: "ORIGIN", name: "Origin", type: "text" },
] as const;

/**
 * KV key for caching the "merge fields have been bootstrapped" flag.
 * Derived from the field tags so the cache self-invalidates when the
 * list of fields changes — no manual version bumps needed.
 */
const MERGE_FIELDS_KV_KEY = `__mc_merge_fields:${[...DESIRED_MERGE_FIELDS].map((f) => f.tag).sort().join(",")}`;

/**
 * Ensure the custom merge fields exist on the audience.
 * Safe to call multiple times — it will skip fields that already exist.
 */
export async function ensureMergeFields(): Promise<string[]> {
  const cfg = getConfig();
  if (!cfg) return [];

  const headers = authHeaders(cfg.apiKey);
  const base = `${baseUrl(cfg.dc)}/lists/${cfg.listId}/merge-fields`;

  // Fetch existing merge fields
  const listRes = await fetch(`${base}?count=100`, { headers });
  if (!listRes.ok) throw new Error("Failed to list Mailchimp merge fields");
  const existing = (await listRes.json()) as {
    merge_fields: Array<{ tag: string }>;
  };
  const existingTags = new Set(existing.merge_fields.map((f) => f.tag));

  const created: string[] = [];
  for (const field of DESIRED_MERGE_FIELDS) {
    if (existingTags.has(field.tag)) continue;

    const res = await fetch(base, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tag: field.tag,
        name: field.name,
        type: field.type,
        public: false,
        required: false,
      }),
    });

    if (res.ok) {
      created.push(field.tag);
      console.log(`[mailchimp] Created merge field: ${field.tag}`);
    } else {
      const err = (await res.json()) as MailchimpErrorResponse;
      console.warn(`[mailchimp] Could not create ${field.tag}: ${err.detail}`);
    }
  }

  return created;
}

/**
 * One-shot merge-field bootstrapper backed by Cloudflare KV.
 *
 * On the first call (no KV entry), it runs `ensureMergeFields()` against the
 * Mailchimp API and writes a flag to KV so subsequent requests skip the work.
 * If KV is unavailable the bootstrap is silently skipped (the fields are
 * assumed to already exist).
 */
export async function ensureMergeFieldsOnce(kv: KVNamespace | null): Promise<void> {
  if (!kv) return; // no KV binding — nothing we can cache, skip

  try {
    const cached = await kv.get(MERGE_FIELDS_KV_KEY);
    if (cached) return; // already bootstrapped for this set of fields

    const created = await ensureMergeFields();

    await kv.put(
      MERGE_FIELDS_KV_KEY,
      JSON.stringify({ bootstrappedAt: new Date().toISOString(), created }),
    );
    console.log(`[mailchimp] Merge fields bootstrapped (created: ${created.join(", ") || "none, all existed"})`);
  } catch (err) {
    // Non-fatal — don't break the subscribe flow for a one-time setup task
    console.warn("[mailchimp] ensureMergeFieldsOnce failed:", err);
  }
}
