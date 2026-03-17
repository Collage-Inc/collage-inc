# Collage.inc — Website Redesign

Static HTML/CSS/JS marketing site for [Collage](https://collage.inc), a digital asset management platform for growing brands.

## Project Structure

```
site/
├── index.html                  # Homepage
├── company.html                # About / Company
├── contact.html                # Contact form
├── pricing.html                # Public pricing (soft, no specific prices)
├── pricing-plans.html          # Prospect-facing pricing (noindex, sent by sales)
├── styles.css                  # Shared styles (design tokens, header, footer, utilities)
├── script.js                   # Shared JS (menu, dropdowns, scroll animations)
├── sitemap.xml                 # XML sitemap (17 public URLs)
├── robots.txt                  # Crawl rules + sitemap reference
├── _headers                    # Cloudflare Pages headers (cache, security)
├── _redirects                  # Cloudflare Pages redirect map (WordPress → redesign)
├── privacy-policy.html         # Privacy policy (GDPR/CCPA compliant)
│
├── product/
│   ├── overview.html           # Product overview
│   ├── organize.html           # Organize feature page
│   ├── discover.html           # Discover feature page
│   ├── distribute.html         # Distribute feature page
│   ├── manage.html             # Manage feature page
│   ├── product.css             # Product page-specific styles
│   └── product.js              # Product page-specific JS
│
├── solutions/
│   ├── marketing.html          # Solutions for Marketing
│   ├── creative-design.html    # Solutions for Creative & Design
│   ├── revenue.html            # Solutions for Revenue/Sales
│   ├── solutions.css           # Solutions page-specific styles
│   └── solutions.js            # Solutions page-specific JS
│
├── blog/
│   ├── index.html              # Blog listing
│   ├── how-growing-brands-manage-content-at-scale.html
│   ├── brandfolder-vs-collage.html
│   ├── parker-baby.html        # Case study
│   ├── loopy-cases.html        # Case study
│   └── customers.css           # Case study styles
│
└── assets/
    ├── Logo.svg / Logo-white.svg / Icon.svg
    ├── Risorsa *.svg           # Decorative shape SVGs
    └── *.mp4                   # Product demo videos (organize, discover, share)
```

## CSS Architecture

All pages load `styles.css` which contains:
- **Design tokens** — 80+ CSS custom properties (colors, spacing, radius, typography)
- **Page accent system** — `--accent`, `--accent-light`, `--accent-bg` overridden per page via body classes
- **Shared components** — header, footer, mobile menu, buttons, containers
- **Scroll animations** — `.animate-in` / `.is-visible` with IntersectionObserver
- **Decorative shapes** — ambient drift animation with staggered timing

Product and solutions pages load their page-specific CSS after `styles.css` for section-level styles (`.prod-*`, `.sol-*`).

## Page Accent System

Each page sets accent colors via body class:

| Body Class | Accent Color | Used On |
|---|---|---|
| `.page-organize` | Purple `#8B6CF6` | Product — Organize |
| `.page-discover` | Amber `#F59E0B` | Product — Discover |
| `.page-distribute` | Emerald `#10B981` | Product — Distribute |
| `.page-manage` | Coral `#FF7F50` | Product — Manage |
| `.page-marketing` | Coral `#FF7F50` | Solutions — Marketing |
| `.page-creative` | Blue `#6473FF` | Solutions — Creative |
| `.page-revenue` | Teal `#40E0D0` | Solutions — Revenue |

## SEO & Production

- **OG tags + Twitter cards** on all 18 pages
- **Canonical URLs** on all pages
- **JSON-LD structured data** — Organization (homepage), FAQPage (pricing-plans), Article (blog posts)
- **`robots.txt`** — allows all, disallows `/pricing-plans`
- **`sitemap.xml`** — 17 public URLs with priority and changefreq
- **`_headers`** — Cloudflare Pages security headers + cache rules

## Third-Party Integrations

### Analytics & Tracking (via GTM)

All tracking is managed through **Google Tag Manager** (`GTM-5KNNS9Z7`), deployed in every HTML file's `<head>` and `<body>`.

| Tag | Purpose | Deployment |
|---|---|---|
| **Google Analytics 4** | Page views, events | GTM |
| **Amplitude** | Product analytics + session replay (100% sample rate) | Direct script in `<head>` (API key: `513a4cfbb24a873e6969c0087f87c0d8`) |
| **LinkedIn Insight Tag** | Ad conversion tracking | GTM (fires on `collage.inc` domain only) |
| **RB2B** | Visitor identification | GTM (fires on `collage.inc` domain only) |

> **Note:** LinkedIn and RB2B tags are filtered by hostname in GTM — they will not fire on dev/staging URLs.

### Consent Management (CMP)

**CookieYes** is the recommended CMP, deployed via GTM with Google Consent Mode v2. This handles GDPR/CCPA cookie consent banners and controls which tags fire based on user consent. Configuration is managed in the CookieYes dashboard; no code changes needed after initial GTM setup.

### Form Handling

The contact form (`contact.html`) uses **Formspree** for submission processing. The form `action` attribute points to a Formspree endpoint — no server-side code required.

### Redirects

`site/_redirects` contains the Cloudflare Pages redirect map:
- WordPress → redesign slug changes (301 permanent)
- Trailing slash normalization
- `/product` → `/product/overview`

## Hosting & Deployment

Hosted on **Cloudflare Pages** (free tier). No build step — deploy the `site/` directory directly.

### Deployment Workflow

1. **Push to `main`** — Cloudflare Pages auto-deploys to the dev site (`collage-website.ross-c8f.workers.dev`)
2. **Verify on dev** — Check pages, test forms, confirm tags aren't firing (GTM hostname filter prevents tracking on dev)
3. **DNS cutover** — When ready for production, point `collage.inc` DNS to Cloudflare Pages. After cutover, pushes to `main` deploy to production automatically.

### Local Preview

```bash
cd site && python3 -m http.server 8000
```

> OG images reference `https://collage.inc/assets/og/...` and will not resolve correctly on dev or localhost. This is expected — they'll work after DNS cutover.

## Key Decisions

- **No build tooling** — vanilla HTML/CSS/JS for simplicity and zero dependencies
- **CSS custom properties** over preprocessors — native, no compilation needed
- **IntersectionObserver** for all scroll-triggered effects — no scroll event listeners for animations
- **`pricing-plans.html`** is `noindex, nofollow` — private page for sales outreach, not discoverable
- **Three JS files** — `script.js` (shared), `product.js`, `solutions.js` with identical core functionality (menu, dropdowns, scroll) plus page-specific logic
