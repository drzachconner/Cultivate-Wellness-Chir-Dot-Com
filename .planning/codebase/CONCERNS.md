# Codebase Concerns

**Analysis Date:** 2026-02-19

## Tech Debt

**API Key Rotation & Git History Exposure:**
- Issue: API keys (OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY) were committed to git history during early development. These keys may be exposed in git history even though `.env` is gitignored now.
- Files: `functions/api/chat.ts`, `functions/api/form-handler.ts` (environment setup only, keys not hardcoded)
- Impact: Any user with read access to git history can extract valid API credentials. Attackers can use stolen keys to impersonate the service or incur charges.
- Fix approach:
  1. Rotate all three API keys immediately (OPENAI, Resend, Brevo)
  2. Use `git-filter-branch` or `BFG Repo-Cleaner` to scrub secrets from git history (requires force-push)
  3. Enable secret scanning on GitHub to catch future exposures
  4. Store all secrets exclusively in `~/.secrets/vault.env.gpg` per CLAUDE.md protocol

**Cloudflare Pages Function Model Mismatch:**
- Issue: `functions/api/chat.ts` specifies `model: 'gpt-4.1'` in OpenAI request, but CLAUDE.md and recent commits indicate the service uses "GPT-5 Mini"
- Files: `functions/api/chat.ts:538` - fetch body specifies `"model": "gpt-4.1"`
- Impact: Model name mismatch may cause API errors or unexpected billing. The actual model being called is unclear (API may accept 'gpt-4.1' as alias for 'gpt-5-mini').
- Fix approach: Verify current model name with OpenAI API docs and update to correct identifier. Consider moving model name to `SITE` config or environment variable for easy updates.

**Missing SSG Prerendering Setup:**
- Issue: Static Site Generation (SSG) is disabled. `build` script runs `vite build` only; `build:ssg` with Puppeteer prerendering is commented out in CLAUDE.md.
- Files: `package.json:8`, `scripts/prerender.js`, `CLAUDE.md:123`
- Impact: Site relies entirely on client-side React hydration. No pre-rendered HTML for bots/crawlers. SEO crawlers may struggle to index 33 condition pages. Initial paint performance suffers.
- Fix approach:
  1. Verify Puppeteer prerender script works correctly (`scripts/prerender.js`)
  2. Test prerendering on all route conditions (check for errors on startup)
  3. Switch build command to `npm run build:ssg` once verified
  4. Consider splitting routes into critical (home, conditions) vs lazy (admin pages)

**Inconsistent Business Address Data:**
- Issue: Practice has merged with Van Every Family Chiropractic Center (Royal Oak location), but `src/data/site.ts` still references old Rochester Hills address as primary location.
- Files:
  - `src/data/site.ts:71-78` - Address shows "1460 Walton Blvd., Ste. 210, Rochester Hills, MI 48309"
  - `functions/api/chat.ts:14-31` - Chatbot system prompt correctly describes merger and Royal Oak location
  - `src/data/site.ts:17` - Description still says "Rochester Hills, MI"
  - 50+ condition pages reference "Rochester Hills, MI" in SEO titles and descriptions
- Impact: Conflicting location data confuses patients, causes wrong address in schema.org/SEO results, harms local search rankings. New patients may attempt to schedule at defunct location.
- Fix approach:
  1. Update `src/data/site.ts` primary address to Van Every Family Chiropractic Center (4203 Rochester Rd, Royal Oak, MI 48073)
  2. Add secondary/legacy address field for existing patients at old location
  3. Audit all 50+ condition pages for "Rochester Hills" references - update to "Royal Oak" or remove location specificity
  4. Update schema.org address in `src/lib/schema.ts` to match
  5. Consider adding breadcrumb on site explaining merger to new visitors

**Deprecated Booking URL Legacy Aliases:**
- Issue: `src/data/site.ts` maintains backward compatibility aliases (`janeUrl`, `janeUrlWithUtm`) that duplicate primary booking data.
- Files: `src/data/site.ts:114-116`
- Impact: Multiple sources of truth increase maintenance burden. If Jane appointment link changes, must update in two places. Potential for desync.
- Fix approach: Audit codebase for use of legacy aliases. Convert all references to use `SITE.booking.url` and `SITE.booking.urlWithUtm`. Remove legacy aliases once migration complete.

---

## Known Bugs

**Chatbot Credential Confusion Partially Addressed:**
- Issue: Recent commit `aab855d` removed "fabricated CACCP credential" from chatbot, but full scope unclear.
- Files: `functions/api/chat.ts` (system prompt still 400+ lines of embedded business knowledge)
- Impact: If outdated/incorrect business info embedded in chat system prompt (e.g., old hours, old services), chatbot will confidently provide wrong information to patients.
- Workaround: Regularly audit chatbot system prompt against `src/data/site.ts` to catch drift
- Safe modification: Extract system prompt into separate file or database, auto-generate from `SITE` config to maintain single source of truth

**Speech Recognition Not Tested on iOS/Safari:**
- Issue: `src/components/ChatbotWidget.tsx:95-99` uses `SpeechRecognition` API with webkit fallback, but iOS Safari support varies by version and region.
- Files: `src/components/ChatbotWidget.tsx` - speech recognition initialization
- Impact: Mic button may silently fail to work on iOS without user feedback. Users may assume feature is broken.
- Workaround: Test on iPhone with Safari before promoting voice feature. Add user-visible error messages if API unavailable.

---

## Security Considerations

**CORS Origin Whitelist Too Permissive for Migration:**
- Risk: Both `https://cultivatewellnesschiro.com` and `https://www.cultivatewellnesschiro.com` are allowed origins in form handlers and chatbot.
- Files: `functions/api/form-handler.ts:164`, `functions/api/chat.ts:458`
- Current mitigation: Whitelist is explicitly defined (not `*`). Only Cultivate Wellness domains allowed.
- Recommendations:
  1. After full Netlify migration, remove any deprecated/old deployment URLs from whitelist
  2. Monitor CORS headers in production for unexpected origins
  3. Add rate limiting to CORS preflight OPTIONS requests to prevent abuse

**Rate Limiting: In-Memory State Not Persistent Across Cloudflare Instances:**
- Risk: Cloudflare Pages Functions can run on any edge location. In-memory rate limiter in `functions/lib/rate-limit.ts` is per-isolate, not global.
- Files: `functions/lib/rate-limit.ts:19`, `functions/api/chat.ts:487`, `functions/api/form-handler.ts:193`
- Current mitigation: Limits are "intentionally generous" (60 req/min for chat, 10 req/min for forms). Only prevents local burst abuse, not distributed attacks.
- Recommendations:
  1. Monitor production logs for suspicious patterns (high request counts from many IPs)
  2. Consider Cloudflare's native rate limiting rules (WAF) as defense against distributed abuse
  3. If abuse detected, switch to external rate limit service (Redis) or Cloudflare Durable Objects for global state

**Input Validation: Message Length Limits Insufficient for Injection:**
- Risk: Form handler validates individual field lengths (2000 chars for chat messages, 5000 for message field) but doesn't validate total payload size or nested structures.
- Files: `functions/api/chat.ts:516-523`, `functions/api/form-handler.ts:216-239`
- Current mitigation: HTML escaping in email notifications (`escapeHtml()` function). OpenAI API request validates JSON schema.
- Recommendations:
  1. Add total request body size limit (reject payloads >1MB)
  2. Validate message count in chatbot (reject if >50 messages in single request)
  3. Consider adding CAPTCHA for form submissions if spam increases

**Email Leakage via Notification Addresses:**
- Risk: Fallback `notificationEmail` in form-handler hardcoded to personal email if env var not set.
- Files: `functions/api/form-handler.ts:202` - `'zachary.riles.conner@gmail.com'` hardcoded
- Current mitigation: Env var `NOTIFICATION_EMAIL` is set in Cloudflare Pages settings.
- Recommendations:
  1. Remove hardcoded email. Throw error if `NOTIFICATION_EMAIL` not configured.
  2. Validate email format on startup (not just at request time)
  3. Never expose personal email in production code

---

## Performance Bottlenecks

**Large System Prompt in Chat Handler:**
- Problem: `functions/api/chat.ts` embeds 447 lines of business knowledge directly in handler (lines 9-447). This string is loaded into memory on every request.
- Files: `functions/api/chat.ts:9-447`
- Cause: System prompt includes full descriptions of 33 conditions, FAQ, testimonials, and business info. Could be 20+ KB of text.
- Improvement path:
  1. Move system prompt to external JSON/YAML file, load once at module initialization
  2. Consider splitting prompt into modules: base context, condition knowledge, response guidelines
  3. Cache prompt in Cloudflare KV for faster cold-start performance
  4. Monitor OpenAI token usage (each 4KB of system prompt = ~1000 tokens cost per request)

**React Lazy Loading All Pages Without Preloading:**
- Problem: All pages use `React.lazy()` in `src/App.tsx` with dynamic imports. No prefetch hints. Users see loading spinner on route change.
- Files: `src/App.tsx` - all page routes use `lazy()`
- Cause: Client must download and parse JS chunk for each page on demand
- Improvement path:
  1. Add `<link rel="prefetch" href="...">` hints for high-traffic pages (Home, Conditions)
  2. Use Vite's `import.meta.glob()` with eager loading for critical pages
  3. Profile bundle sizes per route with `vite-plugin-visualizer`

**Puppeteer SSG Script Not Optimized for CI:**
- Problem: `scripts/prerender.js` likely starts full Chromium instance. Not parallelized for 50+ pages. No timeout handling.
- Files: `scripts/prerender.js`
- Cause: Sequential rendering of all pages during build
- Improvement path:
  1. Implement concurrent rendering (limit to 3-4 parallel Chromium workers)
  2. Add timeout per route (30s max)
  3. Add retry logic for flaky routes
  4. Cache rendered HTML between builds (skip unchanged routes)

---

## Fragile Areas

**Merger Notification Component Prone to Becoming Outdated:**
- Files: `src/components/MergerNotification.tsx`
- Why fragile: Hard-coded merger messaging. If notification should be removed (practice stabilizes) or updated (schedule changes), requires code change and deploy.
- Safe modification:
  1. Move notification content to `src/data/site.ts` under `features` or `announcements` object
  2. Add `showMergerNotification: boolean` flag to enable/disable without code changes
  3. Allows quick banner updates via CLAUDE.md edits without touching component logic
- Test coverage: No tests for announcement/notification display logic

**Condition Pages Template System Assumes Consistent Data Structure:**
- Files: 50+ files in `src/data/conditions/` (e.g., `src/data/conditions/pediatric/adhd-focus-issues.ts`)
- Why fragile: Each condition file manually implements same structure (title, description, sections, FAQ). If template changes (e.g., add new section type), must update all 50 files.
- Safe modification:
  1. Create TypeScript interface for condition data structure
  2. Use factory function/schema validation to catch structure mismatches at build time
  3. Consider extracting condition markdown files and parsing them to data objects
- Test coverage: No validation that condition files match expected schema

**ChatbotWidget Message Formatting Logic Complex Without Tests:**
- Files: `src/components/ChatbotWidget.tsx:21-92` - `formatInline()` and `formatMessage()` functions
- Why fragile: Regex patterns for bold, links, bullet points are fragile to edge cases. No unit tests. Changes risk breaking chat output formatting.
- Safe modification:
  1. Extract formatting functions to separate utility module with unit tests
  2. Add tests for edge cases: nested bold, URLs with params, emoji in text, etc.
  3. Consider using established markdown parser (e.g., `marked` or `remark`) instead of custom regex
- Test coverage: No tests for message formatting

**Contact Form & Guide Form Handlers Share Code But Not Abstracted:**
- Files: `src/components/ContactForm.tsx`, `src/components/GuideForm.tsx` - both call `/api/form-handler` with different payloads
- Why fragile: Duplicate form submission logic. Different validation rules in each component. If handler changes, must update multiple places.
- Safe modification:
  1. Extract shared form submission hook (`useFormSubmit(formType, onSuccess)`)
  2. Centralize validation rules in utility function
  3. Use FormData standard consistently across all form components
- Test coverage: No integration tests for form submission flow

---

## Scaling Limits

**In-Memory Rate Limiter Not Scalable:**
- Current capacity: Cloudflare Pages Functions are stateless. Rate limiter is per-isolate (per edge location). Not suitable for global rate limiting.
- Limit: Single IP can avoid limits by distributing requests across multiple Cloudflare edge locations (or using different IPs).
- Scaling path:
  1. Implement Cloudflare Durable Objects for global rate limit state
  2. Or use Cloudflare WAF rules for rate limiting at edge (no code change needed)
  3. Monitor abuse patterns; escalate to paid WAF rules if distributed attacks increase

**Resend Email Service: No Queue/Retry Logic:**
- Current capacity: Synchronous email send in form handler. If Resend API times out, form submission fails.
- Limit: Resend has rate limits. High-traffic days could exceed quota.
- Scaling path:
  1. Add queue/retry logic: if email fails, queue for retry (use Cloudflare KV or external queue)
  2. Use Resend webhook to confirm delivery instead of relying on synchronous response
  3. Set up Resend alerting for quota/rate limit approaching

**SEO: 50+ Condition Pages Manually Maintained:**
- Current capacity: Adding new condition requires: create data file, create component page, add to routes, add to chatbot prompt.
- Limit: Beyond 100 conditions, manual process becomes unmaintainable.
- Scaling path:
  1. Create condition template generator (ask ChatGPT to fill out condition template, review, commit)
  2. Auto-generate route tree from `src/data/conditions/` directory structure
  3. Auto-update chatbot system prompt from condition data files

---

## Dependencies at Risk

**Puppeteer: Heavy Dependency, Not Used in Production:**
- Risk: Puppeteer (full Chromium) is dev dependency adding 200+ MB to build environment. Only used for optional SSG script.
- Impact: Slows down CI builds, increases container sizes, not actively used since SSG disabled.
- Migration plan:
  1. If SSG re-enabled: Consider lightweight alternatives like `playwright`, `jsdom`, or static site generator (11ty, Hugo)
  2. If SSG stays disabled: Remove Puppeteer from dependencies (saves build time)
  3. For now: Keep but add comments explaining SSG status

**React Router v7: Early Adopter Version:**
- Risk: React Router 7 is relatively new. May have undiscovered bugs or breaking changes in minor versions.
- Impact: Any breaking changes in future releases require code updates.
- Mitigation: Monitor release notes carefully before upgrading. Consider pinning to `^7.9.4` with caution.

**Resend SDK: Actively Maintained, Low Risk:**
- No immediate concerns. Monitor for version updates and breaking changes.

---

## Missing Critical Features

**No Analytics/Monitoring:**
- Problem: No built-in tracking of chatbot conversations, form submissions, or user engagement. No error logging from Cloudflare Pages Functions.
- Blocks: Can't measure chatbot effectiveness, identify broken condition pages, or debug production issues.
- Improvement path:
  1. Add event tracking to form submissions (track conversion rate by source)
  2. Send errors from Pages Functions to external logging service (Sentry, LogRocket)
  3. Add Google Analytics 4 or Plausible for traffic insights

**No Database for Form Submissions:**
- Problem: Form submissions only sent via email and Brevo. No persistent storage in application. If email fails, data is lost.
- Blocks: Can't track submissions, analyze trends, follow up on inquiries.
- Improvement path:
  1. Add Supabase or similar serverless database for form audit log
  2. Store raw submission data for analytics
  3. Add admin dashboard to view submissions, mark follow-ups

**No Admin Interface:**
- Problem: To update business info, create new conditions, or disable merger notification, requires code change + git commit + deploy.
- Blocks: Dr. Zach can't self-serve updates to hours, services, or announcements.
- Improvement path:
  1. Create simple admin dashboard (protected by password/token)
  2. Allow editing `src/data/site.ts` via UI (limited to specific fields: hours, phone, address, announcement)
  3. Store admin credentials in vault; guard with rate limiting

---

## Test Coverage Gaps

**No Tests for Cloudflare Pages Functions:**
- What's not tested: Form validation, email sending, rate limiting, CORS headers, error handling in `functions/api/`
- Files: `functions/api/chat.ts`, `functions/api/form-handler.ts`, `functions/lib/rate-limit.ts`
- Risk: Regressions in API endpoints only discovered after deploy
- Priority: **High** - These are critical business flows (lead capture, customer communication)
- Recommendation: Add integration tests using `wrangler test` or local function runner

**No Tests for React Components:**
- What's not tested: Form submission flows, chatbot widget rendering, message formatting, error states
- Files: `src/components/ContactForm.tsx`, `src/components/ChatbotWidget.tsx`, message formatting logic
- Risk: UI bugs only discovered by manual testing; regressions in form validation
- Priority: **Medium** - Frontend issues are less critical than API issues
- Recommendation: Add unit tests (Vitest) for utility functions and integration tests (Playwright) for critical user flows

**No Tests for Condition Page Generation:**
- What's not tested: Condition data structure validation, route generation, schema.org markup
- Files: `src/data/conditions/`, `src/lib/schema.ts`
- Risk: Inconsistent condition data or broken schema.org markup undetected
- Priority: **Medium** - Could impact SEO and condition page functionality
- Recommendation: Add schema validation at build time; validate condition files match interface

**No E2E Tests:**
- What's not tested: End-to-end user flows (visit home → navigate to condition → submit contact form → receive email)
- Risk: Broken user journeys only discovered by manual QA
- Priority: **Low** - Can be caught by manual testing, but E2E tests would catch regressions
- Recommendation: Add Playwright tests for critical paths (home → contact form, condition page, chatbot)

---

*Concerns audit: 2026-02-19*
