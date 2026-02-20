# Project State

## Current Position

Phase: 3 of 3 — Integration Testing + Deploy
Plan: 03-01 complete (pre-deploy auth cleanup)
Status: IN PROGRESS — admin auth cleaned up, ready for integration testing
Last activity: 2026-02-20 — Completed 03-01-PLAN.md

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

## Completed Work (Feb 20)

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

## Decisions

- **sessionStorage-only auth**: admin_auth stored exclusively in sessionStorage (not localStorage). Closing tab forgets session — intentional security posture.
- **Admin.tsx deleted**: orphaned page-based admin (not routed in App.tsx) removed. Production architecture is AdminActivator + AdminOverlay floating overlay.
- **/admin excluded from crawlers**: `Disallow: /admin` added to robots.txt default User-agent block.
- **Admin auth key is 'admin_auth'** (not 'admin_password') — corrected in api.ts handle401().

## Session Continuity

Started: 2026-02-19
Last session: 2026-02-20

### Remaining Work (Phase 3)
- Test admin panel in local dev (`http://localhost:5173/admin`)
- Test admin panel on production (`https://cultivatewellnesschiro.com/admin`)
- Verify Claude can read/edit Cultivate Wellness site files through admin chat
- Verify git commits + auto-deploy work from admin
- Check no CORS errors on production
- Check no regression in public site functionality
