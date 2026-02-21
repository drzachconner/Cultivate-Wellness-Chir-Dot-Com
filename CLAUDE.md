# Cultivate Wellness Chiropractic Website

## Project Overview
Chiropractic clinic website for Dr. Zach Conner. React + TypeScript + Vite + Tailwind CSS. Hosted on Cloudflare Pages with Pages Functions.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 7
- **Serverless**: Cloudflare Pages Functions (functions/api/form-handler.ts, functions/api/chat.ts)
- **APIs**: OpenAI GPT-5 Mini (AI chatbot), Resend (email), Brevo (email marketing)
- **SSG**: Custom Puppeteer prerender script (scripts/prerender.js)
- **Deployment**: Cloudflare Pages, auto-deploy from `main` branch

## Key Architecture
- `src/data/site.ts` — Single source of truth for all business info, contacts, hours, testimonials
- `src/lib/schema.ts` — Schema.org structured data generators (driven by site.ts)
- `functions/api/form-handler.ts` — Contact form + guide download email handler (Cloudflare Pages Function)
- `functions/api/chat.ts` — AI chatbot powered by OpenAI (Cloudflare Pages Function)
- All pages lazy-loaded via React.lazy() in App.tsx

## Email Architecture
- **Resend**: Transactional email (form notifications, guide delivery). No "Sent with" badge. Domain: `forms@cultivatewellnesschiro.com`.
- **Brevo**: CRM/contact storage + marketing campaigns. Contacts tagged with segmentation attributes:
  - `FIRSTNAME` — first name from form
  - `SOURCE` — `guide_download`, `appointment_request`, or `contact_form`
  - `GUIDE_NAME` — title of downloaded guide (only for guide downloads)
  - `FORM_DATE` — ISO date of form submission
- Each client owns their own Resend + Brevo accounts. Agent backend automates post-account-creation setup.

## Brand Colors (Tailwind)
- `primary-dark`: #002d4e (navy) — primary buttons, headers
- `primary`: #6383ab (soft blue)
- `primary-light`: #73b7ce (sky blue)
- `primary-accent`: #405e84 (medium blue) — hover states

## Cloudflare Pages Config
- **Project name**: cultivate-wellness-chiro
- **Pages URL**: cultivate-wellness-chiro.pages.dev
- **Custom domains**: cultivatewellnesschiro.com, www.cultivatewellnesschiro.com (both live, SSL working)
- **Domain registrar**: Squarespace (nameservers updated to Cloudflare Feb 2026)
- **GitHub**: github.com/drzachconner/Cultivate-Wellness-Chir-Dot-Com
- **Auto-deploy**: GitHub Actions (`.github/workflows/deploy.yml`) — push to main triggers build + deploy
- **GitHub secrets set**: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- **Build command**: `npm run build`
- **Build output**: `dist`
- **Functions dir**: `functions/` (auto-detected by Cloudflare Pages)
- **Config file**: `wrangler.toml`
- **Compatibility**: `nodejs_compat` flag, date `2024-09-23`
- **DNS zone**: cultivatewellnesschiro.com (zone ID: 00d364c0d7d8bae4f050fc53e14a2ffb)
- **Cloudflare account ID**: a353a0ba5d6753a262466e799f1d960c
- **Env vars set in Cloudflare Pages**: OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY, NOTIFICATION_EMAIL, BREVO_LIST_ID

## Cloudflare Pages Functions
- Functions use the `onRequestPost` / `onRequestOptions` export pattern
- Env vars accessed via `context.env.VAR_NAME` (not `process.env`)
- Resend SDK instantiated inside handler (env vars come from context)
- Path-based routing: `functions/api/chat.ts` -> `/api/chat`
- `public/_redirects` handles SPA fallback
- `public/_headers` handles security and caching headers

## Status (as of Feb 21, 2026)
- Site is LIVE on both cultivatewellnesschiro.com and www.cultivatewellnesschiro.com
- SSL working, auto-deploy working (GitHub Actions)
- Migrated from Netlify to Cloudflare Pages (completed)
- Admin panel live: floating overlay powered by agent-backend at cultivate-agent.drzach.ai
- GSD Milestone v1.1 (Admin Panel) ~95% complete — Phase 3 needs final verification + close-out
- INSiGHT Scans page rewritten through tonal neurospinal lens (all ages, official scan names)
- FAQ "frequency of care" update deployed across 8 condition pages with INSiGHT Scans links
- FAQ inline markdown link system added (`[text](url)` in FAQ answer strings)

## Still TODO
- Rotate API keys (Groq, Resend, Brevo) — current ones in .env may be exposed in git history
- Re-enable SSG prerendering once basic build works (change build command back to `build:ssg`)
- Data inconsistency: site.ts still has old Rochester Hills address, but merger notification references new Royal Oak location
- Close out GSD Milestone v1.1 (final human verification + `/gsd:complete-milestone`)

## Directory Structure

```
Cultivate-Wellness-Chir-Dot-Com/
├── .github/workflows/deploy.yml   # GitHub Actions → Cloudflare Pages
├── functions/api/
│   ├── chat.ts                    # AI chatbot (OpenAI GPT-5 Mini)
│   └── form-handler.ts           # Contact form + guide download handler
├── public/
│   ├── images/                    # Optimized site assets
│   ├── _headers                   # Security + caching headers
│   ├── _redirects                 # SPA fallback
│   ├── sitemap.xml
│   └── robots.txt
├── scripts/
│   ├── prerender.js               # Puppeteer SSG prerender script
│   └── extract-content.js         # Content extraction utility
├── src/
│   ├── components/
│   │   ├── conditions/            # Condition-specific page components (7 files)
│   │   ├── Header.tsx / Footer.tsx
│   │   ├── ChatbotWidget.tsx      # Public AI chatbot
│   │   ├── ContactForm.tsx / GuideForm.tsx
│   │   ├── Hero.tsx / CTABanner.tsx
│   │   ├── FloatingReviewWidget.tsx
│   │   ├── MergerNotification.tsx # Practice merger banner
│   │   └── Seo.tsx / JsonLd.tsx   # SEO + structured data
│   ├── data/site.ts               # Single source of truth (business info)
│   ├── lib/schema.ts              # Schema.org generators
│   ├── pages/                     # Route-level page components
│   ├── hooks/                     # Custom React hooks
│   └── App.tsx / main.tsx / routes.ts
├── supabase/                      # Supabase config (if used)
├── wrangler.toml                  # Cloudflare Pages config
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Development Conventions

- **Framework**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3
- **Routing**: React Router 7 with lazy-loaded pages via `React.lazy()`
- **Data pattern**: All business info centralized in `src/data/site.ts` — pages consume this, never hardcode
- **Schema**: `src/lib/schema.ts` generates Schema.org JSON-LD from `site.ts`
- **Serverless**: Cloudflare Pages Functions use `onRequestPost` / `onRequestOptions` exports; env vars via `context.env`
- **Styling**: Tailwind utility classes with custom brand color palette
- **SEO**: Every page includes `<Seo>` and `<JsonLd>` components
- **SSG**: Custom Puppeteer prerender script (`scripts/prerender.js`) — currently disabled, to be re-enabled
- **Condition pages**: 7 reusable components in `src/components/conditions/` (Hero, Approach, Benefits, FAQ, Outcomes, Symptoms, Related)
- **FAQ inline links**: FAQ answer strings support `[text](url)` markdown syntax. `src/lib/render-inline-links.tsx` parses these — internal links render as `<Link>`, external as `<a>`. `stripInlineLinks()` cleans them for Schema.org output in `schema.ts`

## Workflow

```bash
# Development
npm install          # Install dependencies
npm run dev          # Vite dev server with HMR

# Build & Deploy
npm run build        # Production build to dist/
# npm run build:ssg  # SSG build (disabled, re-enable after basic build verified)

# Auto-deploy: push to main → GitHub Actions → Cloudflare Pages
git push origin main

# Prerendering (manual)
node scripts/prerender.js
```

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | Cloudflare Pages | GPT-5 Mini chatbot in `functions/api/chat.ts` |
| `RESEND_API_KEY` | Cloudflare Pages | Transactional email via Resend |
| `BREVO_API_KEY` | Cloudflare Pages | Email marketing list signup |
| `NOTIFICATION_EMAIL` | Cloudflare Pages | Contact form notification recipient |
| `BREVO_LIST_ID` | Cloudflare Pages | Brevo marketing list ID |
| `CLOUDFLARE_API_TOKEN` | GitHub Secrets | Deploy to Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Secrets | Cloudflare account identifier |

## Security

- `.env` is in `.gitignore` — never commit credentials
- API keys may be exposed in early git history — rotation recommended (see TODO)
- Cloudflare Pages Functions access secrets via `context.env`, not `process.env`
- `public/_headers` sets security headers (CSP, X-Frame-Options, etc.)
- Resend SDK instantiated inside handlers to avoid leaking env vars at module scope

## Subagent Orchestration

| Agent | When to Use |
|-------|-------------|
| `codebase-explorer` | Before modifying shared data (`site.ts`, `schema.ts`) or understanding component dependencies |
| `pre-push-validator` | Before every push — lint, type-check, build verification |
| `secrets-env-auditor` | Before commits — scan for leaked API keys (especially given git history exposure) |
| `security-scanner` | After changes to `functions/api/chat.ts` or `form-handler.ts` (auth, input validation) |
| `browser-navigator` | Test chatbot widget, contact form, guide download, floating review widget |
| `docs-weaver` | After adding new pages or modifying API endpoints |
| `performance-profiler` | After adding new lazy-loaded routes or enabling SSG prerendering |

## GSD + Teams Strategy

**Project complexity**: Medium — React SPA with serverless functions (same architecture as bodymind-chiro)

**GSD Phase Structure** (for major feature work):

| Phase | Work | Team Approach |
|-------|------|---------------|
| New pages/conditions | Component + route + SEO + schema | Main agent (sequential — site.ts coupling) |
| Serverless function changes | chat.ts / form-handler.ts | Main agent (small surface area) |
| Full redesign | Multiple components + styles | Teams: component specialists |
| SSG re-enablement | Prerender script + build config | Main agent (sequential) |

**Context Management**:
- `src/data/site.ts` is the coupling point — any teammate touching content needs this file
- Schema.org changes in `src/lib/schema.ts` must stay synchronized with `site.ts`
- Condition page components (`src/components/conditions/`) are independent — safe to parallelize
- Use `/gsd:resume-work` when resuming multi-session work

## MCP Connections

| Server | Purpose |
|--------|---------|
| `filesystem` | Read/write project files during development |
| `gdrive-mcp` | Access Google Drive assets (images, documents) if needed |
