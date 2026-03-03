# XForge Landing Page — Developer Handbook

## 1. Project Overview

**Purpose:** Pre-launch landing page for the XForge Phone Kickstarter campaign. Captures emails, drives Kickstarter follows, and converts $3 refundable reservations via Stripe.

**Conversion funnel:**
```
Visit → Hero (video + email CTA)
     → Partners (social proof)
     → HowItWorks (product education + email CTA)
     → WhyDifferent (passive earning value prop)
     → TechSpecs (hardware specs)
     → WhyReserve (pricing + savings)
     → Footer (email CTA)
     → /reserve (Stripe $3 checkout + Kickstarter notify)
```

**Architecture diagram:**
```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                      │
│  User ──→ Landing Page ──→ Email Form ──→ /reserve   │
│               │                │              │      │
│               ▼                ▼              ▼      │
│         GA4 Events      POST /api/subscribe   │      │
│                              │          ┌─────┴────┐ │
│                              ▼          │          │ │
│                       Mailchimp API   Stripe    Kick-│
│                              │        Checkout  star-│
│                              ▼          │       ter  │
│                     data/subscribers    ▼            │
│                         .json      Payment          │
│                                   Confirmation      │
└──────────────────────────────────────────────────────┘
```

**Tech stack:**

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | App Router framework |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling (custom theme in globals.css) |
| Framer Motion | ^12.34.3 | UI animations, transitions |
| GSAP + ScrollTrigger | ^3.14.2 | Scroll-driven carousel animations |
| Vercel | — | Deployment platform |

**Node version:** 18+ recommended (LTS). Not pinned in package.json.

---

## 2. Local Development Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

**Log locations:**
- Client logs: Browser DevTools console
- Server logs: Terminal running `npm run dev`
- API route logs: Same terminal (server-side)

**Required files before running:**
- Copy `.env.local.example` to `.env.local` and fill in values
- GA4, Mailchimp, and Stripe variables are optional (app runs without them)

---

## 3. Folder Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── layout.tsx          # Root layout (fonts, metadata, GA4 script)
│   ├── page.tsx            # Home page (assembles all sections)
│   ├── globals.css         # Tailwind theme, keyframes, utilities
│   ├── reserve/            # /reserve page
│   │   ├── page.tsx        # Reserve form, FAQ, product image
│   │   └── layout.tsx      # Reserve-specific metadata
│   ├── api/
│   │   ├── subscribe/
│   │   │   ├── route.ts    # POST: email subscribe, GET: info
│   │   │   └── list/
│   │   │       └── route.ts # GET: admin subscriber list
│   │   └── checkout/
│   │       └── route.ts    # GET: Stripe checkout redirect
│   ├── robots.ts           # robots.txt generation
│   └── sitemap.ts          # sitemap.xml generation
├── components/             # React components (one per section)
│   ├── Hero.tsx            # Hero video + email CTA
│   ├── Partners.tsx        # Partner logo marquee
│   ├── HowItWorks.tsx      # Circular gallery + features
│   ├── WhyDifferent.tsx    # Passive earning value prop
│   ├── TechSpecs.tsx       # Hardware specs grid
│   ├── WhyReserve.tsx      # Pricing comparison
│   ├── Footer.tsx          # Footer + email CTA
│   └── GoogleAnalytics.tsx # GA4 script + pageview tracking
├── lib/                    # Shared utilities
│   ├── animations.ts       # Framer Motion variants + shared styles (S)
│   ├── analytics.ts        # GA4 event tracking helpers
│   └── utils.ts            # isValidEmail, KICKSTARTER_URL
├── public/
│   └── placeholders/       # Images, SVGs, videos, logos
├── data/                   # Runtime data (gitignored)
│   └── subscribers.json    # Email subscriber storage
└── next.config.ts          # Security headers
```

**Routing:** Next.js App Router. `/` renders `app/page.tsx`, `/reserve` renders `app/reserve/page.tsx`. API routes under `app/api/`.

---

## 4. Configuration & Constants Map

Where to update key values:

| What | File | Location |
|------|------|----------|
| **Kickstarter URL** | `lib/utils.ts` | `KICKSTARTER_URL` constant |
| **Site domain** | `app/layout.tsx` | `SITE_URL` constant (line 5) |
| **Page title & meta description** | `app/layout.tsx` | `metadata` export |
| **Reserve page meta** | `app/reserve/layout.tsx` | `metadata` export |
| **OG image** | `app/layout.tsx` | `metadata.openGraph.images` |
| **Canonical URL** | `app/layout.tsx` + `app/reserve/layout.tsx` | `metadata.alternates.canonical` |
| **CTA button text** | `components/Hero.tsx`, `components/Footer.tsx`, `components/HowItWorks.tsx` | Search for "Get 40% Discount" |
| **Reserve button text** | `app/reserve/page.tsx` | Search for "Reserve Discount for $3" |
| **Pricing ($299/$499)** | `app/reserve/page.tsx` + `components/WhyReserve.tsx` | Search for "$299" and "$499" |
| **JSON-LD structured data** | `app/page.tsx` | `jsonLd` object |
| **Partner logos** | `components/Partners.tsx` | `PARTNERS` array |
| **Feature descriptions** | `components/HowItWorks.tsx` | `FEATURES` array |
| **Tech spec items** | `components/TechSpecs.tsx` | `SPECS` array |
| **FAQ items** | `app/reserve/page.tsx` | `FAQ_ITEMS` array |
| **Notification bar text** | `components/Hero.tsx` | Search for "Launching soon" |
| **Robots config** | `app/robots.ts` | `robots()` function |
| **Sitemap URLs** | `app/sitemap.ts` | `sitemap()` function |
| **Stripe checkout URL** | `.env.local` | `STRIPE_CHECKOUT_URL` env var |
| **Privacy/Terms URLs** | `components/Footer.tsx` + `app/reserve/page.tsx` | Hardcoded links |
| **Support email** | `app/reserve/page.tsx` | `mailto:support@xforgephone.com` |

---

## 5. Mailchimp / Email Integration

**How it works:**
1. User enters email in Hero, HowItWorks, or Footer
2. Frontend POSTs `{ email, source }` to `/api/subscribe`
3. API saves to `data/subscribers.json` (local backup)
4. API attempts Mailchimp sync (non-blocking — failures don't break the flow)
5. User is redirected to `/reserve`

**Environment variables:**

| Variable | Required | Purpose |
|----------|----------|---------|
| `MAILCHIMP_API_KEY` | No | Format: `xxxx-us1` (datacenter suffix) |
| `MAILCHIMP_LIST_ID` | No | Audience/list ID from Mailchimp dashboard |

**What breaks if list ID changes:** New subscribers go to the new list. Existing subscribers in the old list are unaffected. Update `MAILCHIMP_LIST_ID` in `.env.local`.

**Switching email providers:** Replace the `addToMailchimp()` function in `app/api/subscribe/route.ts`. The local JSON backup continues regardless of provider.

**Failure handling:** Mailchimp errors are caught silently. The local JSON save always succeeds. The response includes `mailchimp: { error: "mailchimp_unavailable" }` if Mailchimp fails.

**Source tracking:** Each submission includes a `source` field (`hero`, `how_it_works`, `footer`) to identify which form converts best.

---

## 6. API Integration Map

### POST /api/subscribe

| Property | Value |
|----------|-------|
| File | `app/api/subscribe/route.ts` |
| Purpose | Subscribe email address |
| Called by | `Hero.tsx`, `HowItWorks.tsx` (EmailSubscription), `Footer.tsx` |
| Env vars | `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID` |
| Side effects | Writes to `data/subscribers.json`, calls Mailchimp API |
| Validation | Content-Type check, email regex, source allowlist |
| Rate limit | In-memory (if `lib/rate-limit.ts` exists) |

**Request:** `{ email: string, source: string }`
**Response:** `{ success: boolean, isNew: boolean, mailchimp: object }`

### GET /api/subscribe/list

| Property | Value |
|----------|-------|
| File | `app/api/subscribe/list/route.ts` |
| Purpose | Admin: list all subscribers |
| Auth | `Authorization: Bearer <ADMIN_API_KEY>` header |
| Env vars | `ADMIN_API_KEY` |
| Side effects | None (read-only) |

### GET /api/checkout

| Property | Value |
|----------|-------|
| File | `app/api/checkout/route.ts` |
| Purpose | Redirect to Stripe Checkout |
| Env vars | `STRIPE_CHECKOUT_URL` |
| Side effects | 307 redirect |

---

## 7. File Dependency Map

```
Hero.tsx
├── Depends on: lib/animations (S), lib/analytics, lib/utils
├── Used by: app/page.tsx
└── ⚠ Change impact: Hero video, email CTA, notification bar

Partners.tsx
├── Depends on: framer-motion, next/image
├── Used by: app/page.tsx
└── ⚠ Change impact: Logo marquee, auto-scroll behavior

HowItWorks.tsx
├── Depends on: gsap, ScrollTrigger, lib/animations, lib/analytics, lib/utils
├── Used by: app/page.tsx
└── ⚠ Change impact: Circular photo carousel, scroll-pinned animation, email form

WhyDifferent.tsx
├── Depends on: lib/animations, framer-motion
├── Used by: app/page.tsx
└── ⚠ Change impact: Reward counter animation, phone mockup

TechSpecs.tsx
├── Depends on: lib/animations, framer-motion, next/image
├── Used by: app/page.tsx
└── ⚠ Change impact: Spec icon animations

WhyReserve.tsx
├── Depends on: lib/animations, framer-motion, next/image
├── Used by: app/page.tsx
└── ⚠ Change impact: Pricing display, save badge

Footer.tsx
├── Depends on: lib/animations, lib/analytics, lib/utils, framer-motion
├── Used by: app/page.tsx
└── ⚠ Change impact: Email form, footer links, pattern background

lib/animations.ts
├── Used by: Hero, Footer, HowItWorks, WhyDifferent, TechSpecs, WhyReserve, reserve/page
└── ⚠ Change impact: ALL section animations and button styles

lib/utils.ts
├── Used by: Hero, Footer, HowItWorks, reserve/page
└── ⚠ Change impact: Email validation, Kickstarter URL across all forms

lib/analytics.ts
├── Used by: Hero, Footer, HowItWorks, reserve/page, GoogleAnalytics
└── ⚠ Change impact: All conversion tracking
```

---

## 8. High-Risk Files

| File | Risk | Why |
|------|------|-----|
| `app/layout.tsx` | **Critical** | SEO metadata, fonts, GA4 script. Breaking this breaks every page. |
| `app/globals.css` | **Critical** | Tailwind theme tokens, keyframes, reduced-motion. All styling depends on this. |
| `lib/animations.ts` | **High** | Shared button styles (`S.btnGold`, `S.emailWrap`, etc.) used by 7 components. Changing class strings breaks all CTAs. |
| `components/HowItWorks.tsx` | **High** | GSAP ScrollTrigger with pinning. Fragile on mobile Safari. Carousel math is position-sensitive. |
| `components/WhyDifferent.tsx` | **High** | GSAP scroll animations + animated counter. Mobile/desktop split logic. |
| `app/api/subscribe/route.ts` | **High** | Email capture pipeline. Breaking this loses leads. |
| `next.config.ts` | **Medium** | Security headers. Misconfiguration can block resources. |
| `components/Hero.tsx` | **Medium** | Video lazy loading + IntersectionObserver. First impression — must work. |

---

## 9. SEO & Metadata System

**Root metadata:** `app/layout.tsx` — title template, description, OG, Twitter, canonical, robots, keywords.

**Reserve metadata:** `app/reserve/layout.tsx` — overrides title, description, OG, Twitter, canonical for `/reserve`.

**JSON-LD:** `app/page.tsx` — Product schema (name, price, availability, brand).

**Sitemap:** `app/sitemap.ts` — generates `/sitemap.xml` with `/` and `/reserve`.

**Robots:** `app/robots.ts` — allows all crawlers, disallows `/api/`, links to sitemap.

**OG image requirements:**
- Recommended: 1200×630px
- Current: `/placeholders/phone-hero.png` (root), `/placeholders/reserve-product.png` (reserve)
- Must be publicly accessible after deploy

**Canonical URLs:**
- Root: `https://kickstarter.xforgephone.com`
- Reserve: `https://kickstarter.xforgephone.com/reserve`
- Update `SITE_URL` in `app/layout.tsx` if domain changes

**H1 usage:** Exactly one H1 per page (Hero title on `/`, reserve form title on `/reserve`).

---

## 10. Analytics & Event Tracking

**Setup:** Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to `.env.local`. Without it, GA gracefully does nothing.

**Script loading:** `components/GoogleAnalytics.tsx` loads gtag.js via `next/script` with `afterInteractive` strategy. Automatic pageview tracking on route changes.

### Event Reference

| Event Name | Category | Trigger | Label/Properties | Purpose |
|------------|----------|---------|------------------|---------|
| `page_view` | (auto) | Route change | `page_path` | Track page visits |
| `email_submit` | engagement | Email form submit | `source`: hero / how_it_works / footer | Measure email capture by form |
| `cta_click` | engagement | CTA button click | CTA label | General CTA tracking |
| `kickstarter_click` | conversion | "Notify me" click | `source`: reserve_page | Kickstarter follow intent |
| `reserve_click` | conversion | "Reserve Discount" click | `stripe_checkout` | Purchase intent |
| `scroll_depth` | engagement | (available, not wired) | Section name | Engagement depth |

**Dashboard dependency:** Event names are used as-is in GA4 reports. Renaming events breaks existing dashboards and comparisons.

**Adding new events:** Use helpers in `lib/analytics.ts`. Pattern: `export const trackNewEvent = (label: string) => event({ action: "new_event", category: "category", label })`.

---

## 11. Rate Limiting & Spam Protection

**Current state:** Source validation on `/api/subscribe` (allowlist of valid sources). Content-Type enforcement.

**Recommended addition:** In-memory or Redis-based rate limiting on `/api/subscribe` (e.g., 5 requests per IP per minute).

**To add rate limiting:**
1. Create `lib/rate-limit.ts` with a sliding window counter
2. Import and call in `app/api/subscribe/route.ts` before processing
3. Return 429 status when limit exceeded

---

## 12. Performance Strategy

| Area | Implementation |
|------|----------------|
| **Image optimization** | `next/image` with automatic WebP/AVIF conversion, lazy loading by default |
| **Video lazy loading** | Hero video uses `preload="none"` + `IntersectionObserver` — only loads when section is 25% visible |
| **Responsive video** | Desktop gets landscape WebM, mobile gets portrait WebM (detected via `matchMedia`) |
| **Animation GPU acceleration** | `will-change-transform` on GSAP-animated elements, `transform` and `opacity` only for animations |
| **Bundle splitting** | Next.js automatic code splitting per route |
| **Font optimization** | `next/font/google` with `variable` loading — no FOUT |
| **Layout shift prevention** | Fixed dimensions on images, `h-[100dvh]` on hero to prevent CLS |
| **Hydration safety** | All client components use `"use client"` directive. Video source set after mount to avoid mismatch |

**Mobile performance notes:**
- Partner marquee uses CSS animation (GPU-composited) not JS
- GSAP ScrollTrigger is only initialized on `md:` breakpoint for desktop carousel
- Mobile carousel has its own lighter GSAP timeline

---

## 13. Cross-Browser Compatibility

### Must Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | Latest | Primary target |
| Safari | Latest + iOS 16+ | Most problematic — see risks below |
| Edge | Latest | Chromium-based, same as Chrome |
| Android Chrome | Latest | Test on mid-range device |
| iOS Safari | 16+ | `100dvh` requires iOS 15.4+ |

### Known Risks

| Risk | Details | Mitigation |
|------|---------|------------|
| **Safari 100vh** | Address bar causes viewport height issues | Using `100dvh` (dynamic viewport height) |
| **GSAP ScrollTrigger pin on iOS** | Pinned sections can jump or flash | Mobile uses separate, simpler GSAP timeline without pin |
| **Safari backdrop-filter** | May have rendering artifacts | `-webkit-backdrop-filter` prefix included via Tailwind |
| **WebM video** | Safari 16+ supports WebM; older versions don't | Video is progressive enhancement — page works without it |
| **SVG preserveAspectRatio** | Some SVGs had `none` causing distortion | Fixed to `xMidYMid meet` |
| **CSS animation-play-state** | Used for partner marquee pause — works in all modern browsers | Tested |
| **Smooth scrolling** | Safari handles `scroll-behavior: smooth` differently | Disabled under `prefers-reduced-motion` |

### Browser QA Checklist

- [ ] Hero video plays (Chrome, Safari, mobile)
- [ ] Email form submits and redirects to /reserve
- [ ] Partner marquee scrolls and pauses on hover
- [ ] HowItWorks carousel rotates on scroll (desktop)
- [ ] HowItWorks carousel pins correctly (desktop)
- [ ] Mobile carousel does not break scroll
- [ ] WhyDifferent reward counter animates
- [ ] All CTAs clickable and styled
- [ ] No horizontal overflow on any viewport
- [ ] /reserve form loads and Stripe link works

---

## 14. Device Scalability & Responsive Testing

### Required Test Viewports

| Category | Width | Device Example |
|----------|-------|----------------|
| Desktop | 1440px | Standard desktop |
| Laptop | 1024px | MacBook Air |
| Tablet | 768px | iPad |
| Mobile (small) | 375px | iPhone SE / iPhone 13 mini |
| Mobile (standard) | 390px | iPhone 14/15 |
| Mobile (Android) | 412px | Samsung Galaxy S series |

### Responsive Breakpoints Used

| Breakpoint | Tailwind Prefix | Usage |
|------------|----------------|-------|
| 640px | `sm:` | Small mobile → larger mobile |
| 768px | `md:` | Mobile → tablet (desktop carousel activates) |
| 1024px | `lg:` | Tablet → desktop (layout switches to side-by-side) |

### Device QA Checklist

- [ ] No horizontal scrollbar at any viewport
- [ ] No overlapping sections
- [ ] Hero title + email fit in one viewport
- [ ] Partner marquee doesn't break or overflow
- [ ] HowItWorks carousel doesn't lock scrolling on mobile
- [ ] Reserve form is fully visible and scrollable
- [ ] FAQ dropdowns open/close without clipping
- [ ] Buttons are at least 44px tall (thumb-friendly)
- [ ] No animation lag on mid-range Android
- [ ] Footer email input stacks properly on mobile

---

## 15. Known Gotchas

| Gotcha | Details |
|--------|---------|
| **ScrollTrigger pin + mobile** | Desktop carousel uses `pin: true` which can cause issues on mobile Safari. The mobile `MobileView` component uses a separate, non-pinned GSAP timeline as a workaround. |
| **GSAP + React strict mode** | GSAP ScrollTrigger instances must be cleaned up in `useEffect` return. Failing to do so causes duplicate pins. |
| **next/image + SVG** | SVGs used via `next/image` must have `width`/`height` or `fill` prop. Some SVGs have `preserveAspectRatio="none"` which causes distortion — use `xMidYMid meet` instead. |
| **Client-only window access** | `window.matchMedia` in Hero (video source detection) is only called inside `useEffect`/`useCallback` to avoid SSR errors. |
| **Hard-coded spacing** | Tailwind arbitrary values like `h-[calc(100dvh-380px)]` are tuned for specific content heights. Changing text content may require recalibrating these. |
| **Env variable prefix** | Only `NEXT_PUBLIC_*` variables are available in client code. Server-only vars (Mailchimp, Admin key) must NOT have this prefix. |
| **Safari viewport height** | `100vh` doesn't account for Safari's address bar. Always use `100dvh` for full-viewport sections. |
| **Subscriber JSON file** | `data/subscribers.json` is written by the API at runtime. On Vercel (serverless), this file is ephemeral — it resets on each deployment. Use Mailchimp as the persistent store. |
| **Carousel photo order** | `PHOTOS` array order in HowItWorks matches the Figma circular path layout. Reordering changes the visual arrangement. |
| **INITIAL_ROTATION** | Controls which carousel photo is centered on load. Calculated based on photo index and `ANGLE_STEP`. Changing the `PHOTOS` array requires recalculating. |

---

## 16. Environment Variables

### .env.local

```env
# Google Analytics 4
# Get Measurement ID from: https://analytics.google.com > Admin > Data Streams
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Mailchimp (server-only)
MAILCHIMP_API_KEY=your-api-key-us1
MAILCHIMP_LIST_ID=your-list-id

# Admin access for subscriber list
ADMIN_API_KEY=your-secret-admin-key

# Stripe Checkout (server-only)
STRIPE_CHECKOUT_URL=https://checkout.stripe.com/c/pay/cs_live_xxx
```

### Variable Scope

| Variable | Scope | Reason |
|----------|-------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client + Server | GA4 script loads in browser |
| `MAILCHIMP_API_KEY` | Server only | Secret — never expose to client |
| `MAILCHIMP_LIST_ID` | Server only | Internal config |
| `ADMIN_API_KEY` | Server only | Secret — protects admin endpoint |
| `STRIPE_CHECKOUT_URL` | Server only | Checkout URL should be server-controlled |

**Critical rule:** Never prefix secret keys with `NEXT_PUBLIC_`. They will be bundled into client JavaScript and exposed to anyone viewing source.

---

## 17. Deployment Guide (Vercel)

### Initial Setup

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the GitHub repository
4. Framework: Next.js (auto-detected)
5. Add environment variables (see Section 16)
6. Deploy

### Environment Variables in Vercel

Go to Project Settings → Environment Variables. Add all variables from Section 16. Mark production/preview/development as appropriate.

### Preview Deployments

Every push to a non-production branch creates a preview URL. Use these for QA before merging to production.

### Production Branch

Set `main` as the production branch in Vercel project settings.

### Rollback

1. Go to Vercel dashboard → Deployments
2. Find the last known-good deployment
3. Click "..." → "Promote to Production"
4. Instant rollback, no rebuild required

### Post-Deploy Verification

- [ ] Home page loads (`/`)
- [ ] Video plays in hero
- [ ] Email form submits (check `data/subscribers.json` or Mailchimp)
- [ ] `/reserve` page loads
- [ ] Stripe checkout link works
- [ ] Kickstarter "Notify me" link works
- [ ] GA4 events firing (check GA4 Realtime report)
- [ ] OG image preview works (use [opengraph.xyz](https://opengraph.xyz))
- [ ] Mobile layout correct (use Chrome DevTools device mode)

---

## 18. Testing & QA Matrix

### Pre-Production Checklist

| Check | Command / Method | Status |
|-------|------------------|--------|
| Build succeeds | `npm run build` | |
| No TypeScript errors | `npx tsc --noEmit` | |
| No lint errors | `npm run lint` | |
| No console errors | Open DevTools in Chrome | |
| Mobile Safari tested | Test on real iPhone or BrowserStack | |
| Android Chrome tested | Test on real Android or BrowserStack | |
| Lighthouse > 90 | Chrome DevTools → Lighthouse | |
| Meta preview validated | [opengraph.xyz](https://opengraph.xyz) | |
| Analytics firing | GA4 Realtime → Events | |
| Email submission works | Submit test email, check Mailchimp | |
| Stripe checkout works | Click reserve button, verify redirect | |
| Kickstarter link works | Click notify button, verify redirect | |
| 375px viewport clean | Chrome DevTools responsive mode | |
| 768px viewport clean | Chrome DevTools responsive mode | |
| 1440px viewport clean | Full browser window | |
| No horizontal scroll | All viewports | |
| Video lazy loads | Scroll hero into view, check Network tab | |
| robots.txt accessible | Visit `/robots.txt` | |
| sitemap.xml accessible | Visit `/sitemap.xml` | |

---

## 19. Ownership & Access

| Resource | Owner | Location |
|----------|-------|----------|
| Domain (`xforgephone.com`) | Project owner | Domain registrar dashboard |
| Vercel project | Project owner | [vercel.com](https://vercel.com) dashboard |
| GitHub repository | Project owner | GitHub |
| Mailchimp account | Marketing team | [mailchimp.com](https://mailchimp.com) |
| Stripe account | Finance/Project owner | [stripe.com](https://stripe.com) |
| GA4 property | Marketing/Analytics team | [analytics.google.com](https://analytics.google.com) |
| Credentials | Stored in Vercel env vars | Never in code |

---

## 20. Release & Versioning

### Recommended Workflow

1. **Branch:** Create feature branch from `main`
2. **Develop:** Make changes, test locally
3. **Preview:** Push branch — Vercel creates preview URL
4. **QA:** Test preview URL against QA matrix (Section 18)
5. **Merge:** PR into `main` — triggers production deploy
6. **Verify:** Run post-deploy verification (Section 17)
7. **Tag:** `git tag v1.x.x && git push --tags`

### Version Tagging

Use semantic versioning: `v1.0.0`
- **Major:** Breaking changes (redesign, new routing)
- **Minor:** New features (new section, new API)
- **Patch:** Bug fixes, copy changes, config updates

### Release Checklist

- [ ] All changes tested locally
- [ ] Preview deployment QA passed
- [ ] No TypeScript or lint errors
- [ ] Environment variables updated if needed
- [ ] Analytics events verified
- [ ] Mobile tested
- [ ] PR reviewed and approved
- [ ] Merged to `main`
- [ ] Production deployment verified
- [ ] Git tag created

### CHANGELOG

Maintain a `CHANGELOG.md` at the project root documenting each release with:
- Date
- Version
- Changes (Added / Changed / Fixed / Removed)
- Author
