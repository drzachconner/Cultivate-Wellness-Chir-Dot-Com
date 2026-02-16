# PRD: Cultivate Wellness Chiropractic Website

## 1. Feature Description

Production chiropractic clinic website for Dr. Zach Conner at Cultivate Wellness Chiropractic (cultivatewellnesschiro.com). The site serves as the primary digital presence for the practice, providing:

- **Service pages** for chiropractic techniques including Talsky Tonal and specialty pages for pediatric, prenatal, and family care
- **AI chatbot** powered by OpenAI GPT-5 Mini — answers patient questions about techniques, hours, insurance, and booking
- **Contact form** with email delivery via Resend and subscriber capture via Brevo email marketing
- **Free guide downloads** — lead magnets (RHKN Guide, Three Ways to Poop, Three Ways to Sleep, Free Guides for Parents) with email capture via `GuideForm` component; form submission triggers PDF delivery via `form-handler.ts`
- **Appointment scheduling** page directing patients to book
- **New patient center** with forms and first-visit preparation
- **Answer Hub** — FAQ-style knowledge base page
- **Events & Workshops** page with signup form (`WorkshopSignupForm`) for community events
- **Insight Scans** page explaining the clinic's scanning technology
- **Three Steps Transition** page for patient education content
- **Merger notification banner** — dismissible notification alerting patients about a practice merger/location change (Rochester Hills to Royal Oak)
- **Floating review widget** — persistent CTA encouraging Google reviews
- **SEO infrastructure** — Schema.org structured data from `site.ts`, React Helmet, lazy-loaded pages, custom Puppeteer prerendering script
- **Condition-specific pages** — dedicated pages for various chiropractic conditions

## 2. Acceptance Criteria

### Core Site
- [ ] Site loads in under 2 seconds on desktop and mobile (Lighthouse performance > 90)
- [ ] All pages render correctly with no console errors
- [ ] Navigation works across all routes; 404 page displays for invalid URLs
- [ ] Site is responsive across mobile, tablet, and desktop breakpoints
- [ ] SSL certificate is valid on cultivatewellnesschiro.com and www.cultivatewellnesschiro.com

### AI Chatbot
- [ ] Chatbot widget loads on all pages without blocking page render
- [ ] Chatbot responds to patient questions within 3 seconds
- [ ] Chatbot provides accurate information consistent with `site.ts` data
- [ ] Chatbot gracefully handles API errors with user-friendly fallback messages

### Contact Form
- [ ] Form submission sends notification email to clinic via Resend
- [ ] Subscriber is added to Brevo email marketing list
- [ ] Form validates required fields before submission
- [ ] Success/error states display correctly
- [ ] Thank-you page renders after successful submission

### Guide Downloads
- [ ] Each guide form captures first name and email
- [ ] Form submission triggers guide PDF delivery via email
- [ ] Subscriber is added to Brevo list
- [ ] Thank-you page renders after successful submission
- [ ] All guide form endpoints point to Cloudflare Pages Functions (not Netlify)

### Merger Notification
- [ ] Banner appears on first visit (after 2-second delay)
- [ ] Banner is dismissible and stays dismissed for the session (sessionStorage)
- [ ] Mobile and desktop variants render correctly
- [ ] Banner contains correct new location information (Royal Oak)

### Deployment
- [ ] `git push` to `main` triggers GitHub Actions deploy workflow
- [ ] Cloudflare Pages build completes without errors
- [ ] Pages Functions (chat.ts, form-handler.ts) respond correctly on production domain
- [ ] All Cloudflare env vars (OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY, NOTIFICATION_EMAIL) are set and accessible

### SEO
- [ ] Schema.org JSON-LD renders on all pages
- [ ] Meta titles and descriptions are unique per page
- [ ] Prerendered HTML available for crawler-critical pages (once SSG is re-enabled)

## 3. Technical Approach

### Architecture
- **SPA with lazy loading**: React 18 + React Router 7, all page components loaded via `React.lazy()` in `App.tsx`
- **Route configuration**: Centralized in `src/routes.ts` for single-source route management
- **Single source of truth**: `src/data/site.ts` centralizes all business info — all components read from this file
- **Schema generation**: `src/lib/schema.ts` generates Schema.org structured data from `site.ts`
- **SSG prerendering**: Custom Puppeteer script (`scripts/prerender.js`) generates static HTML for SEO (currently disabled, pending re-enablement)
- **Serverless functions**: Cloudflare Pages Functions in `functions/api/` handle backend logic
- **SPA fallback**: `public/_redirects` handles client-side routing
- **Security headers**: `public/_headers` configures caching and security policies

### Component Structure
- **Pages** (`src/pages/`): 24 page components including technique pages, specialty pages, guide pages, condition pages
- **Shared components** (`src/components/`): Header, Footer, ChatbotWidget, ContactForm, GuideForm, MergerNotification, FloatingReviewWidget, Hero, CTABanner, MobileCTA, WorkshopSignupForm, SEO, Breadcrumbs, AuthorByline, AboutThisPage, etc.
- **Data layer** (`src/data/`): `site.ts`, `services.ts`, `conditions/`
- **Lib** (`src/lib/`): Schema generators, utility functions
- **Hooks** (`src/hooks/`): Custom React hooks

### API Integrations
| Service | Purpose | Endpoint |
|---------|---------|----------|
| OpenAI GPT-5 Mini | AI chatbot responses | `functions/api/chat.ts` -> `/api/chat` |
| Resend | Transactional email (form notifications + guide delivery) | `functions/api/form-handler.ts` -> `/api/form-handler` |
| Brevo | Email marketing list management | `functions/api/form-handler.ts` -> `/api/form-handler` |

### Deployment Pipeline
1. Developer pushes to `main` branch on GitHub
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers
3. Vite builds the SPA to `dist/`
4. Cloudflare Pages deploys `dist/` + `functions/` directory
5. Pages Functions are auto-detected and deployed as serverless workers

### Build Commands
- `npm run dev` — local development server
- `npm run build` — production build (SPA only)
- `npm run build:ssg` — production build + Puppeteer prerender (currently disabled)
- `npm run typecheck` — TypeScript validation
- `npm run lint` — ESLint checks

## 4. Subagent Deployment Plan

### Phase 1: Pre-Deployment Validation
- **pre-push-validator** — Run before every push: lint, typecheck, build integrity check. Catches TypeScript errors, unused imports, and build failures before they hit CI.
- **secrets-env-auditor** — Run before every commit: scan for exposed API keys (OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY). Critical given the TODO note about keys potentially exposed in git history.

### Phase 2: Post-Deployment Testing
- **browser-navigator** — Automated E2E testing after each deploy:
  - Verify all page routes load without errors (24 pages)
  - Test chatbot widget interaction (open, type, receive response)
  - Submit contact form and verify success state
  - Test guide download forms (RHKN, poop guide, sleep guide, parent guides)
  - Verify merger notification banner appears on first visit and is dismissible
  - Confirm floating review widget renders and links to Google Reviews
  - Test responsive layout on mobile/tablet/desktop viewports
  - Verify workshop signup form submission

### Phase 3: Performance & Security
- **performance-profiler** — Run monthly or after significant changes:
  - Lighthouse scores (target > 90 performance)
  - Page load times on key landing pages (Home, techniques, guides, contact)
  - Bundle size analysis (lazy loading effectiveness)
  - Evaluate SSG prerendering impact once re-enabled
- **security-scanner** — Run after any auth/API changes:
  - Verify Cloudflare Pages Functions don't leak env vars
  - Check for XSS vectors in chatbot response rendering
  - Validate CORS headers on API endpoints
  - Review `public/_headers` security configuration
  - Audit guide download flow for email injection vulnerabilities

### Phase 4: Documentation
- **docs-weaver** — Run after feature additions or significant changes:
  - Update CLAUDE.md with new pages, components, or env vars
  - Generate API documentation for Pages Functions
  - Document guide download flow and email templates
  - Document any data updates to `site.ts`

## 5. Context Engineering Strategy

### CLAUDE.md Context Layers
The CLAUDE.md provides operational context organized as:

1. **Project Overview** (lines 1-4): Quick identification — what, who, and tech stack
2. **Tech Stack** (lines 6-11): Full technology inventory including SSG (Puppeteer prerender) unique to this project
3. **Key Architecture** (lines 13-18): The 5 critical files and their roles — any agent knows where to start
4. **Brand Colors** (lines 20-24): Visual consistency constraints for UI work
5. **Cloudflare Pages Config** (lines 26-41): Complete deployment config including zone ID, account ID, env vars, build settings
6. **Cloudflare Pages Functions** (lines 43-49): Serverless function patterns — critical for agents modifying backend code (env vars via `context.env`, not `process.env`)
7. **Status** (lines 51-54): Current deployment state — agents know the site is live and migrated from Netlify
8. **TODO** (lines 56-61): Active issues and pending work items

### What's Missing from CLAUDE.md (Should Be Added)
- Workflow rules (commit/push behavior) — present in bodymind but absent here
- Key pages list for quick reference
- Guide download feature documentation
- Merger notification context (what it is, when to remove it)

### Subagent Context Requirements
- **browser-navigator**: Needs a page route list (currently must be derived from `src/pages/` directory or `src/routes.ts`), the production URL (cultivatewellnesschiro.com), and guide form IDs for testing
- **pre-push-validator**: Needs build commands from package.json and GitHub Actions workflow path
- **security-scanner**: Needs the env var list (line 41), API endpoint paths (lines 17-18), and the guide download email flow
- **performance-profiler**: Needs the page list and Cloudflare Pages URL; should test with and without SSG prerendering
- **docs-weaver**: Needs the full CLAUDE.md as input context; should flag the TODO items for CLAUDE.md improvements listed above

## 6. Dependencies & Risks

### External Service Dependencies
| Service | Risk Level | Mitigation |
|---------|-----------|------------|
| Cloudflare Pages | Low | Reliable CDN/hosting; auto-deploy from GitHub |
| OpenAI API (GPT-5 Mini) | Medium | Chatbot is non-critical; site functions without it. Rate limits or outages degrade chatbot only |
| Resend | High | Contact form emails AND guide PDF delivery depend on Resend. If Resend is down, patients don't receive guides and clinic doesn't get form submissions |
| Brevo | Low | Marketing list capture is secondary; form/guide submission still works if Brevo fails |
| GitHub Actions | Low | CI/CD pipeline; manual deploy via `wrangler` CLI is fallback |
| Squarespace (registrar) | Low | Domain registered at Squarespace with nameservers pointed to Cloudflare; stable configuration |

### Active Risks
1. **GuideForm still references Netlify endpoint** — `GuideForm.tsx` currently calls `/.netlify/functions/form-handler` instead of `/api/form-handler`. Since the site migrated to Cloudflare Pages, guide downloads are likely broken. This is a critical bug that needs immediate attention.
2. **Data inconsistency (address)** — `site.ts` contains the old Rochester Hills address but the merger notification references the new Royal Oak location. Patients may see conflicting information. Needs a `site.ts` update once the move is finalized.
3. **API keys potentially in git history** — CLAUDE.md TODO notes that Groq, Resend, and Brevo keys may have been committed. Risk of key abuse if repo history is public. Mitigation: rotate all API keys.
4. **SSG prerendering disabled** — The `build:ssg` command exists but is not the default build. SEO crawlers may not index client-rendered content effectively. Mitigation: re-enable once basic Cloudflare Pages build is stable.
5. **No workflow rules in CLAUDE.md** — Unlike bodymind-chiro-website, this project's CLAUDE.md lacks explicit commit/push rules. Agents may not auto-deploy changes, leading to uncommitted work being lost.
6. **Resend is a single point of failure** — Both contact form notifications and guide PDF delivery depend on Resend. Consider adding a fallback email provider or at minimum logging failed sends for retry.
