# Oir Technologies — Site Audit

**Date:** 2026-06-08
**Scope:** `index.html`, `products.html`, `services.html`, `platform.html`, `case-studies.html`, `about.html`, `start-a-project.html`, and `assets/oir.css`, `assets/oir.js`, `assets/oir-mockups.css`, `assets/oir-mockups.js`, `assets/oir-tweaks.js`.
**Brand bar:** Apple × Stripe × Linear × McKinsey — calm, premium, trustworthy, editorial.

---

## Executive summary

The site is **visually excellent** and already on-brand: a disciplined design system (navy / ivory / warm-gold, DM Serif Display + Inter), generous whitespace, editorial typography, and custom CSS product mockups that load instantly. The storytelling (services problem→approach→outcome, about manifesto, case-study impact stats) reads premium.

The gaps are **not visual — they are go-to-market infrastructure**: there is essentially no SEO layer (no OpenGraph, Twitter, structured data, canonical, sitemap, robots, or favicon), no analytics, no product-detail depth (the Products page dead-ends into case studies), limited CTA variety, and a handful of dead links and placeholder contact details. These are exactly the things that separate a beautiful prototype from a launch-ready company site — and they are what the remaining phases address.

**Overall: strong A- design, D SEO/infra.** High leverage available.

---

## ✅ Strengths

- **Coherent design system** — tokens in `oir.css` (`:root`) for color, type scale, spacing, radius, shadows; consistent components (`.btn`, `.eyebrow`, `.h-lg`, `.section-head`, `.card`, `.stat`).
- **Editorial typography & whitespace** — serif display headings, clear hierarchy, calm rhythm. Matches the target references.
- **Premium product mockups** — `oir-mockups.js/css` render clean, intentional product screens as pure CSS (no images) → fast, crisp on retina, restyle instantly with the design controls.
- **Shared shell** — header, mobile menu, and footer are injected by `oir.js` on every page, so navigation is consistent site-wide.
- **Design controls** — `oir-tweaks.js` persists accent/depth/type/radius/density to `localStorage` across pages. A genuinely impressive "we sweat the details" touch.
- **Resilient reveal animations** — `oir.js` uses IntersectionObserver with a scroll fallback **and** a 1.2s safety net, plus `prefers-reduced-motion` handling; content can never be left invisible.
- **Responsive foundation** — sensible breakpoints (980 / 900 / 620) and JS-scaled device mockups.
- **Trust narrative** — privacy-first messaging is woven through About, Platform, and every case study. This is the right wedge for the target buyer.

---

## ⚠️ Weaknesses & gaps

### SEO (most severe — near-zero coverage)
| Missing | Impact |
|---|---|
| OpenGraph tags | Links shared on WhatsApp/LinkedIn/Slack render as bare text — fatal for a referral-driven studio. |
| Twitter card tags | Same for X. |
| Structured data (JSON-LD) | No `Organization`, `WebSite`, `Product`, or `BreadcrumbList` → no rich results, weaker entity understanding. |
| Canonical URLs | Risk of duplicate-content dilution once on a real domain. |
| `sitemap.xml` / `robots.txt` | Crawlers have no map and no crawl directives. |
| Favicon / touch icon / `theme-color` | Browser tabs and mobile bookmarks show a blank glyph. |
| `og:image` | No share image asset exists. |

Meta `title`/`description` **do** exist per page and are reasonable — the structured/social layer is what's absent.

### Conversion
- **Products page dead-ends.** `products.html` flagship rows and the 7-product index all link to `case-studies.html`. There are **no product-detail pages**, so the deepest "I want to understand this product" intent has nowhere to go.
- **CTA monotony.** Almost every CTA is "Start a Project" or "See Our Work." No softer-commitment options ("Book a Discovery Call", "Talk With Oir") to capture buyers not ready to fill a full brief.
- **Dead links.** Footer social icons and legal links (`Privacy`, `Terms`, `Security`) are all `href="#"` (`oir.js`). Footer "Products" column points every item at `products.html` rather than the (missing) detail pages.
- **Placeholder contact info** — `hello@oirtech.com`, `(212) 555-0198` appear in `oir.js` footer and `start-a-project.html`. Note: footer domain (`oirtech.com`) ≠ target domain (`oirtechnologies.com`).
- **Invented metrics** — case-study stats (98%, 2,800+, 11.2K+, etc.) read as real. Fine as illustrative, but should be verified or labeled before launch.

### Accessibility
- **Form labels not associated** — in `start-a-project.html`, `<label>` and `<input>` are siblings inside `.field` with no `for`/`id` pairing and no wrapping. Screen readers won't announce field names. (Fix: `for`/`id` or wrap.)
- **Mobile menu a11y** — toggle has no `aria-expanded`/`aria-controls`; menu open/close state isn't announced; `Esc` doesn't close it; no focus management.
- **Weak focus visibility** — no custom `:focus-visible` ring on nav links, buttons, or cards; keyboard users get only the browser default (and form fields explicitly `outline:none`, replaced only on inputs).
- **Low-contrast text risk** — several muted styles (`rgba(250,250,248,.6)` on navy; `--gray #6B7280` on ivory) sit near or below WCAG AA 4.5:1 for small text.
- **No skip-to-content link.**
- **Decorative SVGs** lack `aria-hidden="true"` (minor noise for SR users).

### Performance
- **Font payload** — `oir.css` imports DM Serif Display + Cormorant Garamond + Inter (multiple weights); `oir-tweaks.js` **also preloads Newsreader on every page** even though it's only used if a visitor opens the design-controls panel and picks "Modern." Trim/condition this.
- **No cache headers** — static assets will be served without long-lived caching until configured (addressed via `netlify.toml`).
- **Minor** — `backdrop-filter: blur` on header/nodes; un-minified assets (acceptable at this size). No render-blocking issues (scripts are at end of `<body>`).
- **Positive** — zero image assets on content pages → excellent base load.

### Visual / consistency
- `products.html` uses a `.phero` hero while `index.html` uses `.hero` — two near-identical navy heroes maintained separately (both received the header-overlay fix). Acceptable, but divergent.
- CTA label set is inconsistent ("Let's Build Together" / "Start a Project" / "Let's Talk About Your Project" / "Send Project Brief").
- `case-studies.html` presents **four** cases with a shallow Problem/Approach/Product structure; Phase 3 calls for **three** deeper, McKinsey-grade narratives (Challenge → Approach → System Design → Product Experience → Impact → Lessons).

### Mobile (verify in QA)
- Device mockups scale to container via JS; need to confirm no horizontal overflow at **360px** (narrowest target).
- Footer link tap-targets (~0.92rem) are adequate but on the small side.
- Design-controls FAB is fixed bottom-right; confirm it never occludes a primary CTA on small screens.

---

## 🎯 Prioritized remediation (mapped to phases)

| Priority | Item | Phase |
|---|---|---|
| P0 | OG + Twitter + JSON-LD + canonical on every page; `sitemap.xml`, `robots.txt`, favicon, `og:image` | 5 |
| P0 | 7 product-detail pages (fix the Products dead-end) | 2 |
| P1 | Deeper 3 case studies | 3 |
| P1 | CTA variety + fix dead footer/legal links + wire product links | 4 |
| P1 | Analytics scaffold (GA / Plausible / PostHog, no secrets) | 6 |
| P2 | Netlify config + caching + deployment runbook | 7 |
| P2 | A11y: label association, focus rings, mobile-menu aria, skip link | 4/8 |
| P3 | Trim font payload; verify metrics; replace placeholder contact | post-launch |

---

## Notes carried into later phases
- **Canonical scheme:** `.html` URLs on `https://oirtechnologies.com` (matches served files; robust locally and on Netlify). Home → `https://oirtechnologies.com/`.
- **`og:image`:** will ship as a branded SVG (`assets/og-image.svg`); a 1200×630 PNG export is recommended for scrapers that don't render SVG (flagged in the launch report).
- **Contact details** remain placeholders pending real values from the client.
