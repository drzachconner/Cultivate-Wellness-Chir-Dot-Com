# Architecture

**Analysis Date:** 2026-02-19

## Pattern Overview

**Overall:** Decoupled frontend + serverless backend (Jamstack pattern)

**Key Characteristics:**
- **Data-first architecture**: Single source of truth (`src/data/site.ts`) drives all business logic, schema.org output, and UI content
- **Lazy-loaded SPA**: React Router 7 with React.lazy() for code splitting and performance
- **Serverless API**: Cloudflare Pages Functions for email, AI chatbot, and webhooks (no persistent backend)
- **Content-driven**: 47 condition pages generated from structured data (not hardcoded templates)
- **SEO-optimized**: Every page includes Helmet-managed meta tags + Schema.org JSON-LD structured data

## Layers

**Presentation (UI Components):**
- Purpose: Render views, handle user interaction, manage local form state
- Location: `src/components/` and `src/pages/`
- Contains: React components (26 in components/, 18 page routes), layout wrappers, form handlers
- Depends on: Data layer (site.ts), utilities (schema.ts, validate.ts, breadcrumbs.ts)
- Used by: App.tsx orchestrates all route-level components

**Data Layer:**
- Purpose: Single source of truth for all business and domain data
- Location: `src/data/`
- Contains:
  - `site.ts` — Business info (address, hours, doctor, testimonials, services)
  - `services.ts` — Service offerings
  - `conditions/` — 47 condition pages with medical/wellness content (pediatric, adult pain, neurological, pregnancy, special populations, general wellness)
  - `conditions/types.ts` — TypeScript interfaces for condition data shape
  - `conditions/icon-map.ts` — SVG icon resolver for condition sections
- Depends on: Nothing (pure data)
- Used by: Pages, components, schema generators

**Library/Utilities:**
- Purpose: Reusable logic for schema generation, validation, SEO, analytics
- Location: `src/lib/`
- Contains:
  - `schema.ts` — Schema.org generators (organization, person, medicalWebPage, faq, breadcrumb)
  - `validate.ts` — Contact form validation (email, message length, spam detection via honeypot)
  - `breadcrumbs.ts` — Breadcrumb JSON-LD generation
  - `canonical.ts` — Canonical URL helpers
  - `log.ts` — Console logging utility
  - `analytics.ts` — AI traffic tracking
- Depends on: Data layer (SITE config)
- Used by: Components and pages for SEO, validation, analytics

**Serverless Functions:**
- Purpose: Handle API requests (email, chat, webhooks)
- Location: `functions/api/` and `functions/lib/`
- Contains:
  - `chat.ts` — OpenAI GPT-5 Mini chatbot endpoint (`/api/chat`), rate-limited, context-aware
  - `form-handler.ts` — Contact form + guide download handler (`/api/form`), sends Resend + Brevo emails
  - `lib/rate-limit.ts` — In-isolate rate limiter for DDoS protection
- Depends on: External APIs (OpenAI, Resend, Brevo)
- Used by: Frontend forms and chatbot widget (fetch to `/api/*`)
- Pattern: Cloudflare Pages Functions use `onRequestPost`/`onRequestOptions` exports, access env vars via `context.env`

**Hooks:**
- Purpose: Reusable React logic
- Location: `src/hooks/`
- Contains: `useSeo.ts` — SEO metadata resolver for Helmet
- Used by: Seo component

## Data Flow

**Page Load → SEO:**
1. User navigates to page (e.g., `/conditions/adhd-focus-issues`)
2. React Router lazy-loads the page component
3. Page component imports condition data from `src/data/conditions/`
4. Page wraps `<Seo>` component with title/description/OG tags
5. Page wraps `<JsonLd>` components for breadcrumb, medicalWebPage, FAQ schemas
6. `src/lib/schema.ts` generators convert `site.ts` into Schema.org JSON
7. Helmet injects `<meta>` tags and `<script type="application/ld+json">` into document head

**Contact Form Submission:**
1. User fills ContactForm.tsx with name, email, message
2. Form validates locally using `src/lib/validate.ts` (email regex, length limits, honeypot)
3. Form submits POST to `/api/form-handler`
4. Cloudflare Pages Function:
   - Checks rate limit using IP + endpoint key
   - If blocked: returns 429 Too Many Requests
   - If allowed: validates input again server-side
   - Sends email via Resend to `NOTIFICATION_EMAIL`
   - Adds contact to Brevo email list
   - Returns success/error JSON
5. Frontend shows toast notification (success or error)

**AI Chatbot Flow:**
1. ChatbotWidget.tsx appears in bottom-right corner
2. User types message or clicks quick question button
3. Widget POST to `/api/chat` with conversation history
4. Cloudflare Pages Function:
   - Checks rate limit (100 requests/hour per IP)
   - Calls OpenAI GPT-5 Mini with system prompt (embedded business knowledge)
   - System prompt includes merger details, Dr. Zach info, Talsky Tonal explanation
   - Streams response back to client
5. Widget displays streamed response with markdown rendering (bold, links, URLs)

**Condition Page Rendering:**
1. ConditionPageWrapper.tsx parses URL slug (e.g., `adhd-focus-issues`)
2. Looks up condition data from `src/data/conditions/index.ts`
3. Passes data to ConditionPage.tsx component
4. ConditionPage composes section components:
   - ConditionHero — Hero image + title
   - ConditionSymptoms — Common signs (icon + description)
   - ConditionApproach — Step-by-step treatment approach
   - ConditionBenefits — Benefits of care
   - ConditionOutcomes — Expected outcomes
   - ConditionFAQ — Q&A section
   - RelatedConditions — Links to similar conditions
5. Schema generators create MedicalWebPage + FAQ schemas
6. Page outputs fully SEO-optimized HTML with structured data

**State Management:**
- Local component state: Form inputs, dropdown opens/closes, chatbot messages
- No global state library (Redux, Zustand) — data is mostly read-only from site.ts
- Route state: Handled by React Router
- Cloudflare KV would be needed for persistent storage (not currently used)

## Key Abstractions

**Condition Data Model:**
- Purpose: Define structure for medical/wellness content pages
- Examples: `src/data/conditions/pediatric/adhd-focus-issues.ts`, `src/data/conditions/adult-pain/sciatica.ts`
- Pattern: TypeScript interface (ConditionPageData) ensures all conditions have consistent schema (intro, symptoms, benefits, approach, outcomes, faqs, relatedConditions, schema)
- Benefit: Single template (ConditionPage.tsx) renders 47 different pages with no hardcoded content

**Schema.org Generators:**
- Purpose: Convert SITE config into JSON-LD structured data
- Examples: `organizationSchema()`, `personSchema()`, `medicalWebPageSchema()`
- Pattern: Functions receive data object, return @context/@type/@properties object
- Benefit: No hardcoded schema — all driven by site.ts, so migrations (office moves, doctor name changes) auto-propagate to SEO

**Rate Limiting:**
- Purpose: Lightweight DDoS protection in Cloudflare isolate
- Pattern: In-memory Map of IP → request count + window start time
- Cleanup runs every 5 minutes to prevent unbounded memory
- Limits: 100 requests/hour for chatbot, 10 requests/hour for contact form (per IP)

**Validation:**
- Purpose: Prevent spam and malformed submissions
- Pattern: `validateContactForm()` checks email format, message length, honeypot field (company field)
- Benefit: Spam bots filling form fields rarely handle hidden fields correctly

## Entry Points

**Browser Entry:**
- Location: `src/main.tsx`
- Triggers: Page load
- Responsibilities: Mounts React app to `#root` DOM element, initializes Router, Helmet provider

**App Root:**
- Location: `src/App.tsx`
- Triggers: Every route navigation
- Responsibilities: Wraps all routes with global layout (Header, Footer, ChatbotWidget), manages lazy loading, error boundary, global schema injection, scroll-to-top, AI traffic tracking

**API Endpoints:**
- Location: `functions/api/chat.ts` and `functions/api/form-handler.ts`
- Triggers: POST requests from frontend (fetch)
- Responsibilities: Rate limiting, input validation, external API calls, response formatting

**Page Components:**
- Location: `src/pages/*.tsx`
- Triggers: React Router on pathname change
- Responsibilities: Fetch data from `src/data/`, compose section components, inject SEO/schema

## Error Handling

**Strategy:** Progressive degradation with user-visible fallbacks

**Patterns:**

1. **React Error Boundary** (`src/components/ErrorBoundary.tsx`):
   - Catches render errors in component tree
   - Shows fallback UI instead of blank screen
   - Prevents cascading failures

2. **Lazy Load Fallback** (App.tsx):
   - Suspense boundary with PageLoader spinner
   - User sees loading indicator, not 404
   - Code-split chunks download in background

3. **Form Validation** (`src/lib/validate.ts`):
   - Frontend validates before submit (UX)
   - Backend validates again (security)
   - Client sees specific error message (e.g., "Email must be valid")

4. **API Error Handling** (`functions/api/form-handler.ts`, `chat.ts`):
   - Rate limit exceeded → 429 response + user message
   - Invalid input → 400 response + validation error
   - External API failure (OpenAI, Resend) → 500 response with fallback message
   - Chatbot prompt injection attempts → filtered by rate limiter + system prompt boundaries

5. **Network Failure** (ChatbotWidget.tsx):
   - fetch() error → user sees "Unable to send message"
   - No retry logic (prevents hammering API)

## Cross-Cutting Concerns

**Logging:**
- Approach: Browser `console.log/error`, Cloudflare function logs to stderr
- What's logged: API errors, rate limit blocks, form validation failures
- Tools: `src/lib/log.ts` for standardized format (optional)

**Validation:**
- Approach: Two-layer (client + server)
- Client: Fast feedback for UX (email regex, length limits)
- Server: Security gate (honeypot, rate limit, input sanitization)
- Implementation: `src/lib/validate.ts`, honeypot field in forms

**Authentication:**
- Approach: None for public site (no user login)
- Chatbot: Rate-limited by IP, no user session
- Contact form: No auth required, honeypot spam detection
- Admin: No admin panel (all data in Git, deploy via GitHub Actions)

**CORS & Security:**
- `public/_headers`: CSP, X-Frame-Options, referrer policy
- `public/_redirects`: SPA fallback (/* → index.html)
- Chatbot: System prompt instructs model to use specific info only, rate limit prevents abuse
- Form: HTML sanitization before email (escapeHtml function)

---

*Architecture analysis: 2026-02-19*
