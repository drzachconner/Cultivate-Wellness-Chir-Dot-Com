# Codebase Structure

**Analysis Date:** 2026-02-19

## Directory Layout

```
Cultivate-Wellness-Chir-Dot-Com/
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions CI/CD → Cloudflare Pages
├── .planning/
│   └── codebase/                  # GSD codebase documentation
├── functions/
│   ├── api/
│   │   ├── chat.ts               # OpenAI chatbot endpoint
│   │   └── form-handler.ts       # Contact form + guide download endpoint
│   └── lib/
│       └── rate-limit.ts         # IP-based rate limiting utility
├── public/
│   ├── images/                    # Optimized site images (webp, png)
│   ├── guides/                    # PDF downloads (3 guides)
│   ├── conditions/                # Condition page hero images
│   ├── _headers                   # Security headers + caching rules
│   ├── _redirects                 # SPA fallback (/* → index.html)
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── prerender.js               # Puppeteer SSG script (disabled)
│   └── extract-content.js         # Content extraction utility
├── src/
│   ├── components/                # React UI components (26 files)
│   │   ├── conditions/            # Reusable condition page sections
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ChatbotWidget.tsx      # AI chat bubble widget
│   │   ├── ContactForm.tsx        # Contact form component
│   │   ├── GuideForm.tsx          # Guide download form
│   │   ├── ErrorBoundary.tsx      # React error boundary
│   │   ├── Seo.tsx                # Helmet-based SEO meta tags
│   │   ├── JsonLd.tsx             # Schema.org JSON-LD injector
│   │   └── [other components]
│   ├── data/
│   │   ├── site.ts                # SINGLE SOURCE OF TRUTH
│   │   ├── services.ts            # Service offerings
│   │   ├── conditions/            # Condition content (47 pages)
│   │   │   ├── types.ts           # ConditionPageData interface
│   │   │   ├── icon-map.ts        # SVG icon resolver
│   │   │   ├── index.ts           # Condition export barrel
│   │   │   ├── pediatric/         # 12 condition files
│   │   │   ├── pregnancy-women/   # 4 condition files
│   │   │   ├── neurological/      # 3 condition files
│   │   │   ├── adult-pain/        # 11 condition files
│   │   │   ├── general-wellness/  # 11 condition files
│   │   │   └── special-populations/ # 6 condition files
│   ├── hooks/
│   │   └── useSeo.ts              # SEO metadata resolver
│   ├── lib/
│   │   ├── schema.ts              # Schema.org generators
│   │   ├── validate.ts            # Form validation
│   │   ├── breadcrumbs.ts         # Breadcrumb JSON-LD
│   │   ├── canonical.ts           # Canonical URL helpers
│   │   ├── analytics.ts           # AI traffic tracking
│   │   └── log.ts                 # Logging utility
│   ├── pages/                     # Route-level page components (18 files)
│   │   ├── Home.tsx
│   │   ├── AboutUs.tsx
│   │   ├── MeetDrZach.tsx
│   │   ├── Pediatric.tsx
│   │   ├── Prenatal.tsx
│   │   ├── Family.tsx
│   │   ├── NewPatientCenter.tsx
│   │   ├── Contact.tsx
│   │   ├── conditions/
│   │   │   ├── ConditionIndex.tsx
│   │   │   ├── ConditionPage.tsx
│   │   │   └── ConditionPageWrapper.tsx
│   │   └── [other pages]
│   ├── App.tsx                    # Root component, route orchestrator
│   ├── main.tsx                   # React mount point
│   ├── routes.ts                  # SSG route list
│   └── vite-env.d.ts
├── supabase/                      # Supabase config (legacy, not used)
├── dist/                          # Build output (gitignored)
├── wrangler.toml                  # Cloudflare Pages config
├── tailwind.config.js             # Tailwind CSS custom theme
├── vite.config.ts                 # Vite bundler config
├── tsconfig.json                  # TypeScript settings
├── package.json                   # Dependencies
├── package-lock.json              # Lock file
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

## Directory Purposes

**`.github/workflows/`:**
- Purpose: Continuous integration and deployment
- Contains: `deploy.yml` → triggers on push to main, builds and deploys to Cloudflare Pages
- Key files: `.github/workflows/deploy.yml`

**`.planning/codebase/`:**
- Purpose: GSD (Get Shit Done) documentation for Claude agents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md
- Key files: None yet (empty on init, populated by GSD commands)

**`functions/`:**
- Purpose: Cloudflare Pages Functions (serverless backend)
- Contains: API handlers, rate limiting utility
- Key files: `functions/api/chat.ts`, `functions/api/form-handler.ts`, `functions/lib/rate-limit.ts`
- Auto-detected by Cloudflare Pages (no additional config needed beyond wrangler.toml)

**`public/`:**
- Purpose: Static assets served by Cloudflare Pages
- Contains: Images, PDFs, redirect/header rules, SEO files
- Key files:
  - `_headers` — Security headers (CSP, X-Frame-Options) + cache rules
  - `_redirects` — SPA fallback (all unmatched routes → index.html)
  - `robots.txt` — Search engine instructions
  - `sitemap.xml` — SEO sitemap (can be dynamically generated)

**`scripts/`:**
- Purpose: Build and utility scripts
- Contains: Puppeteer prerender, content extraction
- Key files: `scripts/prerender.js` (disabled, to be re-enabled)

**`src/components/`:**
- Purpose: Reusable React UI components
- Contains: 26 components (layout, forms, sections, widgets)
- Subdirectories:
  - `conditions/` — 7 condition page sections (reused across 47 condition pages)
- Pattern: PascalCase filenames (e.g., ChatbotWidget.tsx)
- Key files:
  - Header.tsx, Footer.tsx — Global layout
  - ChatbotWidget.tsx — AI chat bubble
  - ContactForm.tsx, GuideForm.tsx — Form components
  - Seo.tsx, JsonLd.tsx — SEO utilities
  - ErrorBoundary.tsx — Error fallback
  - `conditions/*` — Reusable condition page sections

**`src/data/`:**
- Purpose: Single source of truth for all business and domain content
- Contains: Configuration, service info, 47 condition pages
- Structure:
  - `site.ts` — Business identity, contact, hours, doctor, testimonials, services
  - `services.ts` — Service offerings
  - `conditions/` — Categorized condition pages with structured content
- Pattern: Each condition is a `.ts` file exporting a `ConditionPageData` object
- Key files:
  - `src/data/site.ts` — **MASTER CONFIG** (every page consumes this)
  - `src/data/conditions/types.ts` — TypeScript interfaces
  - `src/data/conditions/index.ts` — Barrel export (imports all 47 conditions)

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: SEO metadata resolution
- Key files: `useSeo.ts`

**`src/lib/`:**
- Purpose: Reusable utilities and helpers
- Contains: Schema generators, validation, breadcrumbs, analytics
- Key files:
  - `schema.ts` — Schema.org JSON-LD generators
  - `validate.ts` — Form validation (email, length, honeypot)
  - `breadcrumbs.ts` — Breadcrumb schema generation
  - `canonical.ts` — Canonical URL helpers

**`src/pages/`:**
- Purpose: Route-level page components (one per route)
- Contains: 18 page components + condition pages
- Pattern: PascalCase filenames matching route names
- Structure:
  - Root pages: Home.tsx, AboutUs.tsx, Contact.tsx, etc.
  - `conditions/` subdirectory:
    - ConditionIndex.tsx — `/conditions` listing page
    - ConditionPageWrapper.tsx — Route wrapper, slug → data lookup
    - ConditionPage.tsx — Template composing condition sections
- Key files: Any page consumes Seo + JsonLd + data from src/data/

**`src/`:**
- Purpose: Frontend source code
- Key files:
  - `App.tsx` — Root component, route orchestrator, global layout
  - `main.tsx` — React mount point (`ReactDOM.createRoot()`)
  - `routes.ts` — List of all routes (used for SSG prerendering)
  - `vite-env.d.ts` — Vite type definitions

## Key File Locations

**Entry Points:**
- `src/main.tsx` — Browser entry, mounts App to #root
- `src/App.tsx` — Route orchestrator, global layout wrapper
- `functions/api/chat.ts` — Chatbot API endpoint (`POST /api/chat`)
- `functions/api/form-handler.ts` — Contact form API endpoint (`POST /api/form`)

**Configuration:**
- `src/data/site.ts` — Business info, hours, doctor, testimonials, services (MASTER CONFIG)
- `wrangler.toml` — Cloudflare Pages config, environment variables
- `vite.config.ts` — Build configuration
- `tailwind.config.js` — Tailwind CSS custom colors and theme

**Core Logic:**
- `src/lib/schema.ts` — All Schema.org generators (org, person, medicalWebPage, faq, breadcrumb)
- `src/data/conditions/` — 47 condition pages (content + SEO + structured data)
- `functions/api/chat.ts` — AI chatbot logic (OpenAI integration)
- `functions/lib/rate-limit.ts` — DDoS protection

**Testing:**
- No test directory found (testing not currently configured)
- See TESTING.md for recommendations

**Build Output:**
- `dist/` — Compiled frontend (Vite output, not committed to Git)
- Functions are deployed separately by Cloudflare Pages

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `ChatbotWidget.tsx`, `ConditionHero.tsx`)
- Pages: PascalCase (e.g., `Home.tsx`, `MeetDrZach.tsx`)
- Utilities/data: camelCase (e.g., `validate.ts`, `site.ts`, `rate-limit.ts`)
- Types: camelCase file, PascalCase export (e.g., `types.ts` exports `ConditionPageData`)

**Directories:**
- UI sections: kebab-case subdirectories (e.g., `conditions/`, `pregnancy-women/`)
- Organizational: lowercase (e.g., `components/`, `functions/`, `public/`)

**Variables/Functions:**
- Exported consts: UPPER_CASE (e.g., `SITE`, `CATEGORY_LABELS`, `MAX_MESSAGE_LENGTH`)
- Functions: camelCase (e.g., `validateContactForm()`, `organizationSchema()`)
- React components: PascalCase (e.g., `ChatbotWidget`, `ConditionPage`)

**Routes:**
- kebab-case paths (e.g., `/conditions/adhd-focus-issues`, `/meet-dr-zach`)
- Route slugs match condition file names (e.g., `adhd-focus-issues.ts` → `/conditions/adhd-focus-issues`)

## Where to Add New Code

**New Feature:**
- Primary code: Determine if it's a page route or reusable component
  - New page: Create file in `src/pages/PageName.tsx`
  - New reusable component: Create file in `src/components/ComponentName.tsx`
- Data: Add config to `src/data/site.ts` if it's business-related info
- Tests: Add to test directory (not yet configured, see TESTING.md)

**New Condition/Wellness Page:**
- Implementation: `src/data/conditions/{category}/{slug}.ts` (e.g., `src/data/conditions/pediatric/new-condition.ts`)
- Export the condition from `src/data/conditions/index.ts` (barrel file)
- Add route to `src/routes.ts` for SSG prerendering
- Add to `App.tsx` routes (auto-handled by ConditionPageWrapper if slug is correct)
- No component code needed — reuse ConditionPage.tsx template with data

**New Service:**
- Add to `src/data/services.ts` array
- Reference in Seo component or schema generators as needed

**New Utility Function:**
- Shared helpers: `src/lib/utils.ts` (or create domain-specific file)
- Validation rules: `src/lib/validate.ts`
- Schema generators: `src/lib/schema.ts`

**New API Endpoint:**
- Create file: `functions/api/my-endpoint.ts`
- Export: `onRequestPost` or `onRequestOptions` handler
- Add to route list in `src/App.tsx` if frontend needs to call it
- Rate limit: Use `isAllowed()` from `functions/lib/rate-limit.ts`

## Special Directories

**`dist/`:**
- Purpose: Build output (Vite bundles React into JS)
- Generated: Yes (via `npm run build`)
- Committed: No (in .gitignore)
- Deployment: Cloudflare Pages reads `dist/` and `functions/` directories

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in .gitignore)
- Size: Large, not checked in

**`supabase/`:**
- Purpose: Supabase config (legacy)
- Generated: No
- Committed: Yes (but not actively used)
- Status: Unused, can be removed if no database features added

**`.git/`:**
- Purpose: Git repository history
- Generated: Yes (via `git init`)
- Committed: No (not tracked by Git)

**`.env` (not tracked):**
- Purpose: Local development environment variables
- Exists: No (deliberately not in repo for security)
- What to add: `OPENAI_API_KEY`, `RESEND_API_KEY`, `BREVO_API_KEY`, `NOTIFICATION_EMAIL`
- Note: Cloudflare Pages reads env vars from dashboard settings, not .env file

---

*Structure analysis: 2026-02-19*
