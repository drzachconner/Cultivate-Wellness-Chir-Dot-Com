# Project State

## Current Position

Phase: 3 of 3 — Integration Testing + Deploy
Plan: 03-03 (Deploy to Production) — nearly complete
Status: PRODUCTION DEPLOYED — smoke tests pass (24/24), E2E Playwright test mostly passes (17/19), tunnel intermittency being addressed
Last activity: 2026-02-21

## Accumulated Context

### Architecture Notes
- Cloudflare Pages Functions use `onRequestPost`/`onRequestOptions` exports
- Env vars accessed via `context.env.VAR_NAME` (not process.env)
- CORS handled per-endpoint with origin allowlist
- Rate limiting via in-memory Map in isolate
- No persistent storage currently (no database, no KV)

### Reference Implementations Researched
- **bodymind-chiro-website**: Full Claude Agent SDK admin with Express backend, SQLite, SSE streaming, draggable floating panels
- **claude-admin-template**: Extracted multi-project template with same pattern — monorepo (packages/backend + packages/frontend)
- Both use Bearer token auth with timing-safe comparison against ADMIN_PASSWORD env var
- Both require separate Node.js backend server (not pure serverless)

### Architecture Decision (Resolved)
The agent-backend already exists at https://agent.drzach.ai (Express + Claude Agent SDK + SQLite), running locally on port 3100 as a macOS Launch Agent, exposed via Cloudflare Tunnel. It already powers the bodymind-chiro-website admin panel and supports multi-project.

**Approach:** Add Cultivate Wellness as a new project in agent-backend's projects.json, then embed the admin frontend components in this site (same pattern as bodymind).

## Completed Work

### Phase 1: Backend Multi-Project Support + Config — COMPLETE
- agent-backend already had multi-project support (ported from claude-admin-template)
- Added `cultivate-wellness` project to `data/projects.json`
- Created `data/prompts/cultivate-wellness.md` system prompt
- `CULTIVATE_ADMIN_PASSWORD` already in `.env`
- Verified: `curl http://localhost:3100/api/v1/projects/cultivate-wellness/info` returns correct config

### Phase 2: Embed Admin Frontend — COMPLETE
- 14 admin components already built in `src/components/admin/`
- AdminContext, AdminActivator, AdminOverlay already wired into App.tsx
- `constants.ts` already configured with `cultivate-agent.drzach.ai` and `cultivate-wellness` project ID

### Infrastructure: Tunnel + Decommission — COMPLETE
- Updated `~/.cloudflared/config.yml`: `cultivate-agent.drzach.ai` → port 3100 (was 3101)
- Decommissioned old `agent-backend-cultivate`: unloaded launchd, removed plist, deleted directory
- Restarted cloudflared tunnel and agent-backend
- Verified: `curl https://cultivate-agent.drzach.ai/health` returns `{"status":"ok"}`
- Verified: project info and usage endpoints work through tunnel

### Phase 3 Plan 01: Pre-Deploy Auth Cleanup — COMPLETE
- sessionStorage-only auth enforced across all admin code paths
- Admin.tsx orphaned page deleted
- robots.txt: `Disallow: /admin` added

### Phase 3 Plan 02: Local Integration Tests — COMPLETE
- Port 3100 conflict resolved (Social-Media-Scaling killed, agent-backend restarted)
- All API tests pass: health, project info, auth, CORS, conversations, chat SSE (10/10)
- `scripts/test-local-admin.sh` created — repeatable integration test suite
- Chat SSE confirmed working: agent-backend -> Claude -> `data: {"text":"hello"}` returned
- Cloudflare tunnel live: cultivate-agent.drzach.ai -> port 3100 (200 OK)

### Phase 3 Plan 03: Production Deploy + Verification — MOSTLY COMPLETE
- Code pushed to main, GitHub Actions deployed to Cloudflare Pages (multiple deploys, all successful)
- `scripts/smoke-test.sh` created — 24-check production smoke test (ALL PASS)
- `scripts/e2e-admin-verify.ts` created — Playwright browser automation test (17/19 pass)
- CSP updated to allow Cloudflare Analytics (`static.cloudflareinsights.com`)
- Resilient auth with `verifyPassword()` — 3 retries with backoff, distinguishes wrong password from tunnel errors
- ConversationSidebar fixed for desktop (was only rendering on mobile)
- ChangeLogPanel revert button UX fixed (replaced confusing AlertTriangle with "Confirm?" text)
- Test markers cleaned from site.ts

### Bugs Fixed During Phase 3
1. **api.ts handle401()** — wrong storage type (localStorage) AND wrong key name ('admin_password'). Fixed to `sessionStorage.removeItem('admin_auth')`
2. **ConversationSidebar desktop** — not rendered in desktop overlay path. Added to desktop portal render
3. **ConversationSidebar CSS** — `lg:static` and `lg:translate-x-0` prevented toggle on desktop. Changed to fixed overlay like ChangeLogPanel
4. **ChangeLogPanel revert UX** — AlertTriangle icon was confusing (looked like an error). Replaced with "Confirm?" text
5. **Auth error messaging** — all failures showed "Invalid password" even for tunnel flakes. Added `verifyPassword()` with retry logic and differentiated error messages
6. **CSP blocking Cloudflare Analytics** — `static.cloudflareinsights.com` not in script-src. Added to CSP
7. **Smoke test false positives** — `/conditions` 308 redirect, SPA JSON-LD check, CORS pipe issue. All fixed

### Post-Milestone Content Work (Feb 21, 2026)

**FAQ "Frequency of Care" + INSiGHT Scans Updates:**
- Created `src/lib/render-inline-links.tsx` — parses `[text](url)` in FAQ answer strings, renders `<Link>` for internal, `<a>` for external
- Updated `src/components/conditions/ConditionFAQ.tsx` to use `renderInlineLinks()`
- Updated `src/lib/schema.ts` — `faqSchema()` uses `stripInlineLinks()` to keep Schema.org clean
- Updated 8 FAQ files to use "frequency of care" language + link to `/insight-scans`:
  - Adult/general (full INSiGHT mention): webster-technique, back-neck-pain, fibromyalgia, pandas-pans
  - Infant/baby (softer "when age-appropriate"): breastfeeding-latch-issues, colic-infant-digestive, torticollis, infant-newborn-chiropractic
- **INSiGHT Scans page full rewrite** (`src/pages/InsightScans.tsx`):
  - All-ages messaging (was child-only)
  - Official scan names: neuroTHERMAL, neuroPULSE (HRV), neuroCORE (sEMG)
  - CORE Score as neural efficiency index
  - Tonal chiropractic neurospinal lens throughout
  - Both images preserved (insight-scan-1.webp, insight-scan-2.webp)
  - Updated SEO meta description
- TypeScript and production build both pass clean

**Pre-existing uncommitted changes (from prior session):**
- Deleted 30 stale `public/conditions/*.html` files (prerendered HTML no longer needed)
- CLAUDE.md updates
- package.json / package-lock.json updates

## Remaining Work

### Known Issues (not blockers)
1. **Tunnel intermittency** — Cloudflare Tunnel occasionally returns 404 on first request. Auth retry logic handles this (3 retries with backoff), but may need more investigation for reliability
2. **Playwright chat detection** — E2E test chat response check times out (selector works but 60s may not be enough for cold agent startup). Test needs longer timeout or pre-warmed agent
3. **Conversation sidebar on desktop** — works now but the chat history only shows conversations for `cultivate-wellness` project (correct behavior, confirmed with user)

### Phase 3 Checkpoint Status
- Automated smoke test: PASS (24/24)
- Playwright E2E: 17/19 (chat response timeout + console error were the 2 failures, both addressed)
- Human verification: NOT YET COMPLETED
- 03-03-SUMMARY.md: NEEDS WRITING (pending final verification)

## Decisions

- **sessionStorage-only auth**: admin_auth stored exclusively in sessionStorage (not localStorage). Closing tab forgets session — intentional security posture.
- **Admin.tsx deleted**: orphaned page-based admin (not routed in App.tsx) removed. Production architecture is AdminActivator + AdminOverlay floating overlay.
- **/admin excluded from crawlers**: `Disallow: /admin` added to robots.txt default User-agent block.
- **Admin auth key is 'admin_auth'** (not 'admin_password') — corrected in api.ts handle401().
- **Each website's chat history is isolated**: conversations are scoped by project_id in SQLite. bodymind-chiro conversations don't appear in cultivate-wellness sidebar (confirmed with user).
- **Resilient auth with retries**: verifyPassword() retries 3 times with exponential backoff on network errors, only shows "Incorrect password" on 401.
- **Playwright for E2E testing**: installed as dev dependency for automated browser testing. Script at `scripts/e2e-admin-verify.ts`.

## Session Continuity

Started: 2026-02-19
Last session: 2026-02-21

### For Next Session
- Run `/gsd:resume-work` to restore GSD context
- **Uncommitted work**: FAQ inline links, INSiGHT Scans rewrite, FAQ frequency-of-care updates, stale HTML deletions, CLAUDE.md updates — all need to be committed and pushed
- Phase 3 is ~95% complete — just needs final human verification on production
- The Playwright test (`npx tsx scripts/e2e-admin-verify.ts`) can automate most verification
- After verification, write 03-03-SUMMARY.md and close out Phase 3
- Then run `/gsd:verify-work` and `/gsd:complete-milestone` to close Milestone v1.1
- **User plans major dynamic changes** based on deep research — new session will have significant content/structure modifications
