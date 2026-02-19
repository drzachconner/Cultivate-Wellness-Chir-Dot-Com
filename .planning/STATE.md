# Project State

## Current Position

Phase: 1 of 3 — Backend Multi-Project Support + Config
Plan: Not yet created
Status: Research complete, roadmap created, ready to plan Phase 1
Last activity: 2026-02-19 — Milestone v1.1 researched and roadmapped

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

## Session Continuity

Started: 2026-02-19
Context: Research of bodymind-chiro-website and claude-admin-template complete. Site codebase fully mapped.
