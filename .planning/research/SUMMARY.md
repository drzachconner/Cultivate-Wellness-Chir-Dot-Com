# Research Summary: Admin Dashboard for Cultivate Wellness

## Architecture Decision
Reuse the existing `agent-backend` (Express + Claude Agent SDK + SQLite) at `https://agent.drzach.ai` and embed the admin frontend from bodymind-chiro-website.

## What Exists
- **agent-backend**: Express server on port 3100, exposed via Cloudflare Tunnel at agent.drzach.ai
  - Claude Agent SDK for AI-powered code editing
  - SQLite for conversations, usage tracking, change logs
  - Bearer token auth (timing-safe comparison)
  - SSE streaming for real-time responses
  - Currently single-project (hardcoded REPO_PATH to bodymind)
  - Database already supports multi-project (project_id field)

- **bodymind admin frontend**: Self-contained React components (no external library)
  - 14 component files in `src/components/admin/`
  - 1 context file: `src/contexts/AdminContext.tsx`
  - 2 hooks: `useDraggable.ts`, `useDeployPoller.ts`
  - Activated via `/admin` route or `?admin=true`
  - Draggable floating panels rendered as portals
  - Configurable backend URL and project ID via Vite env vars

## What Needs to Change

### Backend (agent-backend) — Multi-Project Support
1. Replace hardcoded REPO_PATH with project registry (projects.json)
2. Dynamic SYSTEM_PROMPT per project
3. Add CORS origins for cultivatewellnesschiro.com
4. Create Cultivate Wellness system prompt
5. Per-project cost tracking (DB already supports this)

### Frontend (Cultivate Wellness site) — Embed Admin
1. Copy admin components from bodymind (adapted for Cultivate brand)
2. Add AdminProvider wrapping App
3. Add AdminActivator for /admin route detection
4. Render AdminOverlay panels in layout
5. Configure constants (PROJECT_ID, AGENT_URL, welcome message)
6. Hide public chatbot when admin panel is open

## Key Files to Modify/Create

### In agent-backend:
- `src/config.ts` — Replace static REPO_PATH/SYSTEM_PROMPT with project registry lookup
- `src/projects.ts` (new) — Project registry with per-project config
- `data/projects.json` (new) — Project config file
- `.env` — Add Cultivate Wellness CORS origins

### In Cultivate Wellness:
- `src/App.tsx` — Wrap with AdminProvider, add AdminActivator, render panels
- `src/contexts/AdminContext.tsx` (new) — Panel state management
- `src/components/admin/` (new, 14 files) — Admin panel components
- `src/components/admin/constants.ts` — Project-specific config
- `src/hooks/useDraggable.ts` (new) — Drag position tracking
- `src/hooks/useDeployPoller.ts` (new) — Deploy status polling

## Watch Out For
- agent-backend .env has plaintext password — should use vault-get
- CORS origins must include both www and non-www domains
- System prompt must be customized for Cultivate Wellness data structure
- Deploy countdown needs to match Cloudflare Pages build time (~90s)
- Public ChatbotWidget should be hidden when admin panel is active
