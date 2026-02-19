# Roadmap: Milestone v1.1 — Admin Dashboard

## Overview
Add a full-featured admin dashboard to Cultivate Wellness Chiropractic, powered by the existing agent-backend at agent.drzach.ai.

**Total phases:** 3
**Total requirements:** 18

---

## Phase 1: Backend Multi-Project Support + Config

**Goal:** Make agent-backend support multiple projects and configure Cultivate Wellness as a new project.

**Requirements:** BACK-01, BACK-02, BACK-03, BACK-04, CONFIG-01, CONFIG-02, CONFIG-03

**Scope:** Changes to `/Users/zachconnermba/Code/agent-backend/` only.

**Success Criteria:**
1. agent-backend loads project config from projects.json
2. Chat endpoint uses project-specific REPO_PATH and SYSTEM_PROMPT
3. CORS allows requests from cultivatewellnesschiro.com
4. Health endpoint returns status for both projects
5. Existing bodymind functionality is unchanged

**Status:** Not started

---

## Phase 2: Embed Admin Frontend in Cultivate Wellness

**Goal:** Add the admin panel UI to the Cultivate Wellness site, adapted from bodymind.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, UI-01, UI-02, UI-03, UI-04, UI-05, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, TRACK-01, TRACK-02

**Scope:** Changes to `/Users/zachconnermba/Code/Cultivate-Wellness-Chir-Dot-Com/` only.

**Success Criteria:**
1. Visiting /admin opens the admin panel overlay
2. Password gate validates against agent.drzach.ai
3. Chat messages stream in real-time with tool status
4. Conversation history loads and persists
5. Change log shows recent file edits and commits
6. Panel is draggable on desktop, fullscreen on mobile
7. Public chatbot hides when admin is active

**Status:** Not started

---

## Phase 3: Integration Testing + Deploy

**Goal:** Verify end-to-end admin functionality and deploy to production.

**Requirements:** All (integration verification)

**Success Criteria:**
1. Admin login works on production domain (cultivatewellnesschiro.com/admin)
2. Claude can read and edit Cultivate Wellness site files
3. Git commits and pushes trigger auto-deploy
4. Deploy countdown timer works correctly
5. No regression in public site functionality
6. No CORS errors between production frontend and agent.drzach.ai

**Status:** Not started
