# Phase 3: Integration Testing + Deploy - Research

**Researched:** 2026-02-20
**Domain:** End-to-end admin verification, production deploy, regression testing
**Confidence:** HIGH — all findings based on direct codebase inspection and live environment testing

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Test scope**: Full round-trip required — send real edit command through admin chat, verify file changes, then revert
- **Test environments**: Both localhost (`http://localhost:5173/admin`) AND production (`https://cultivatewellnesschiro.com/admin`)
- **Deploy gate**: All tests must pass before deploying — no shipping broken admin
- **Deploy approach**: Claude picks (direct push vs feature branch + PR)
- **Post-deploy verification**: Automated smoke test that hits key endpoints and reports pass/fail
- **Auth persistence**: sessionStorage ONLY — no localStorage. Require re-login on every tab close
- **Regression scope**: ALL public routes must return 200; SEO elements (Schema.org, meta tags, sitemap) intact; chatbot, contact form, guide downloads verified
- **Monitoring**: Local Mac + Cloudflare tunnel uptime is sufficient — no additional monitoring needed
- **If regression post-deploy**: Hotfix immediately — public site is the priority

### Claude's Discretion
- Exact automated vs manual test split
- Deploy approach (direct push vs PR)
- Loading skeleton and error state details
- Test execution order and parallelization strategy

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

All requirements from REQUIREMENTS.md are verification targets, not new builds. Phase 3 confirms they work end-to-end.

| ID | Description | Research Support |
|----|-------------|-----------------|
| BACK-01 | Agent-backend supports multiple projects via project registry | Confirmed: projects.json has both bodymind-chiro and cultivate-wellness |
| BACK-02 | Each project has its own REPO_PATH, SYSTEM_PROMPT, config | Confirmed: cultivate-wellness entry has repoPath, systemPromptFile, etc. |
| BACK-03 | CORS origins configurable per project | Confirmed: allowedOrigins in projects.json; **BLOCKER: wrong server on port 3100** |
| BACK-04 | Cultivate Wellness project registered with correct repo path | Confirmed: `"repoPath": "/Users/zachconnermba/Code/Cultivate-Wellness-Chir-Dot-Com"` |
| AUTH-01 | User can access admin panel at /admin route | Partially: AdminActivator catches /admin and opens floating overlay |
| AUTH-02 | User must enter password to access admin functionality | Confirmed: inline password gate in AdminOverlay |
| AUTH-03 | Password validated against agent-backend using Bearer token auth | Confirmed: fetchUsage() used as auth check |
| AUTH-04 | "Remember me" for persistent auth | **CONFLICT: CONTEXT.md says sessionStorage ONLY — PasswordGate still has localStorage Remember Me checkbox** |
| UI-01 | Admin panel renders as draggable floating overlay | Confirmed: AdminOverlay.tsx with useDraggable hook |
| UI-02 | Admin panel: minimize, resize, close | Confirmed: SIZE_PRESETS compact/medium/large, minimize button |
| UI-03 | Multiple admin panels open simultaneously | Confirmed: AdminContext.panels array, multiple AdminOverlay instances |
| UI-04 | Admin works on mobile (fullscreen mode) | Confirmed: isMobile detection, fullscreen render path |
| UI-05 | Public chatbot hidden when admin panel active | Confirmed: `{!hasAnyPanel && <ChatbotWidget />}` in Layout |
| CHAT-01 | Streaming chat to Claude | Confirmed: sendChat + parseSSEStream |
| CHAT-02 | Real-time tool status display | Confirmed: ToolStatusBar, onToolStart/onToolResult callbacks |
| CHAT-03 | View and switch conversation history | Confirmed: ConversationSidebar, handleSelectConversation |
| CHAT-04 | Delete past conversations | Confirmed: handleDeleteConversation |
| CHAT-05 | Quick action buttons | Confirmed: QuickActions component with QUICK_ACTIONS from constants.ts |
| TRACK-01 | Recent file changes and git commits in change log panel | Confirmed: ChangeLogPanel, listChanges() API |
| TRACK-02 | Deploy countdown after successful git push | Confirmed: deployCountdown state, DEPLOY_COUNTDOWN_SECONDS = 90 |
| CONFIG-01 | Welcome message customized for Dr. Zach | Confirmed: WELCOME_MESSAGE in constants.ts |
| CONFIG-02 | Quick actions relevant to Cultivate Wellness | Confirmed: QUICK_ACTIONS in constants.ts |
| CONFIG-03 | System prompt includes Cultivate Wellness context | Confirmed: data/prompts/cultivate-wellness.md in agent-backend |
</phase_requirements>

---

## Summary

Phase 3 is verification + deploy, not new development. The codebase is essentially complete — 14 admin components built, routes wired, backend configured. However, a **critical runtime blocker** was discovered during research: the wrong server is currently occupying port 3100, meaning the admin panel cannot connect to the real agent-backend. Additionally, there are two **pre-deploy code fixes** required by CONTEXT.md decisions: removing localStorage from the PasswordGate (must be sessionStorage-only) and adding `/admin` to robots.txt.

The test plan has three gates: (1) fix the port conflict and code issues, (2) test locally, (3) test production. The deploy is a direct push to main (GitHub Actions auto-deploys). Post-deploy, a bash smoke test hits all key endpoints.

**Primary recommendation:** Fix the port conflict and sessionStorage issues first, test locally, then push to production. These are small targeted fixes, not new architecture.

---

## Current Environment State (Verified Live)

### What IS Working
| Component | Status | Evidence |
|-----------|--------|----------|
| Production site | Live | `curl https://cultivatewellnesschiro.com/` → 200 |
| Sitemap | Live | `curl .../sitemap.xml` → 200 |
| Build | Passing | `npm run build` → success, 1.59s |
| TypeScript | Clean | `npx tsc --noEmit` → no errors |
| Git branch | Main, 1 commit ahead | Ready to push |
| Cloudflare tunnel | Running | `cloudflared` PID 54867 active |

### What is BROKEN (Critical Blockers)
| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Wrong server on port 3100 | Social-Media-Scaling admin server (PID 84267) grabbed port 3100; real agent-backend process (PID 84367) is running but failed to bind | Kill Social-Media-Scaling process on port 3100, restart agent-backend |
| Agent-backend not responding to production origins | Port 3100 is Social-Media-Scaling which only allows localhost:5173 and localhost:3000 — rejecting cultivatewellnesschiro.com → 500 | Fix the port conflict |
| localStorage "Remember me" violates CONTEXT.md decision | PasswordGate.tsx line 29 writes to localStorage when remember=true; AdminContext line 60 reads localStorage on rehydration | Remove Remember Me checkbox; change to sessionStorage-only |

### What Needs Minor Fix (Pre-Deploy)
| Issue | Location | Fix |
|-------|---------|-----|
| /admin not in robots.txt Disallow | `public/robots.txt` | Add `Disallow: /admin` |
| Admin.tsx is orphaned (not routed) | `src/pages/Admin.tsx` | Leave as-is (floating overlay approach handles it), or delete to avoid confusion |

---

## Architecture Patterns (Confirmed for This Phase)

### Admin Access Architecture
The admin panel is NOT a route. Instead:
1. User navigates to `/admin`
2. `AdminActivator.tsx` (rendered globally) detects the path
3. Calls `addPanel()` and navigates back to `/` (replaces history)
4. `AdminOverlay` renders as floating panel over any page

This means `/admin` never renders a dedicated page — `Admin.tsx` exists in `src/pages/` but is unused. The overlay approach is intentional.

### Auth Flow (Current vs Required)
**Current (WRONG per CONTEXT.md):**
```
PasswordGate → Remember Me checked → localStorage.setItem('admin_auth', pw)
AdminContext.useEffect → reads localStorage on rehydration → persists across tab closes
```

**Required (per CONTEXT.md: "Session storage only — re-login on every tab close"):**
```
PasswordGate → Remove Remember Me checkbox → sessionStorage.setItem('admin_auth', pw) always
AdminContext.useEffect → reads sessionStorage only → cleared on tab close automatically
```

Files to change:
- `src/components/admin/PasswordGate.tsx` — remove remember state + checkbox, always use sessionStorage
- `src/contexts/AdminContext.tsx` — line 60: remove `localStorage.getItem('admin_auth')` check
- `src/contexts/AdminContext.tsx` — line 113: remove `localStorage.removeItem('admin_auth')` in signOut
- `src/pages/Admin.tsx` — lines 13, 22-23, 27-28, 37-38: remove localStorage references (this page is orphaned but clean code is good)

### Deploy Countdown Architecture
Two countdown implementations exist:
1. **`useDeployPoller`** hook (in `AdminOverlay`) — polls `HEAD /` for ETag/Last-Modified changes; auto-reloads page when deploy detected
2. **`deployCountdown` state** (in `ChatInterface`) — simple timer from DEPLOY_COUNTDOWN_SECONDS (90s); counts down, shows "Deploying..." banner; does NOT auto-reload

The floating overlay uses `useDeployPoller` (ETag-based detection). The full-page Admin route uses `ChatInterface`'s simple countdown timer. Since the floating overlay is the primary interface, `useDeployPoller` is the production behavior.

**Important:** Cloudflare Pages typically deploys in 60-120 seconds after push. The ETag poller starts 30s after commit, then checks every 15s. This should reliably detect production updates.

### Round-Trip Test Design
The CONTEXT.md mandates a full round-trip test:
```
1. Open admin panel at localhost:5173
2. Authenticate with password
3. Send chat: "Please add a comment '// integration-test-marker' to the top of src/data/site.ts, then commit with message 'test: integration test marker'"
4. Verify: read src/data/site.ts, confirm comment exists
5. Verify: git log shows the test commit
6. Revert: "Please run git revert HEAD --no-edit, then push"
7. Verify: comment is gone, revert commit visible in git log
8. Verify: deploy countdown appears after each push
```

This proves: frontend → agent backend → Claude agent → file tools → git → GitHub → Cloudflare Pages pipeline.

---

## Common Pitfalls

### Pitfall 1: Port Conflict (Current Active Issue)
**What goes wrong:** Multiple Node servers competing for port 3100. The wrong server wins and silently intercepts all traffic. The Cloudflare tunnel has no awareness of which server is running.
**Why it happens:** Social-Media-Scaling admin server started before agent-backend.
**How to avoid:** Before testing, verify port 3100 belongs to agent-backend: `lsof -i :3100` should show PID matching `agent-backend/src/server.ts`.
**Warning signs:** `/health` returns 200 but requests with production Origin headers return 500 CORS errors.

### Pitfall 2: CORS 500 vs 403 Confusion
**What goes wrong:** The agent-backend CORS middleware throws `new Error()` when an origin is rejected. This triggers the global Express error handler which returns 500. A 500 from CORS rejection looks like a server error, not a CORS rejection.
**Why it happens:** `cors()` middleware calling `callback(new Error(...))` → global handler → 500.
**How to avoid:** When seeing 500 on OPTIONS or cross-origin requests, check the origin against `allowedOrigins`. A CORS error with 500 (not 403) is a code pattern, not a misconfiguration of origins.
**Warning signs:** Response body `{"error":"Internal server error"}` with no `Access-Control-Allow-Origin` header present.

### Pitfall 3: Deploy Not Detected by ETag Poller
**What goes wrong:** Cloudflare CDN may serve a cached response with the same ETag even after a new deploy.
**Why it happens:** Cloudflare's CDN caches aggressively. `cache: 'no-store'` on the HEAD request bypasses browser cache but Cloudflare edge cache may still serve stale.
**How to avoid:** The deploy poller waits 30s before first check and polls every 15s. This is usually sufficient. If the auto-reload doesn't trigger, manual refresh will work. The `_headers` file has `Cache-Control: public, max-age=0, must-revalidate` for HTML which should help.
**Warning signs:** Deploy countdown reaches 0 but page content is stale after refresh.

### Pitfall 4: Helmet Blocks Cross-Origin Responses at Browser Level
**What goes wrong:** `helmet()` sets `Cross-Origin-Resource-Policy: same-origin`. Browsers enforce this header and block responses from different origins regardless of CORS headers.
**Why it happens:** helmet's default configuration is very restrictive.
**How to avoid:** Verify that the agent-backend includes CORS headers (`Access-Control-Allow-Origin`) AND that helmet's CORP header is overridden or set to `cross-origin` for API routes.
**Warning signs:** CORS appears correct in curl but browser network tab shows CORS errors in console.
**Note:** This may require adding `crossOriginResourcePolicy: { policy: 'cross-origin' }` to the helmet config for the agent-backend if browser errors appear despite correct allowedOrigins.

### Pitfall 5: SessionStorage Not Persisting Across Frames
**What goes wrong:** AdminOverlay uses sessionStorage for auth. If the user refreshes the page, sessionStorage survives. But if the user opens a new tab and navigates to `/admin`, the new tab has no sessionStorage auth → prompts for password.
**Why it happens:** sessionStorage is tab-scoped, not window-scoped.
**How to avoid:** This is the intended behavior per CONTEXT.md ("re-login on every tab close"). Document this as expected.

### Pitfall 6: Admin.tsx Page is Orphaned
**What goes wrong:** `src/pages/Admin.tsx` exists and references `localStorage` + has a full-page PasswordGate+ChatInterface layout. It is NOT registered in `App.tsx` routes. This could cause confusion or accidentally get registered.
**Why it happens:** Architectural evolution — the approach shifted from dedicated /admin page to floating overlay.
**How to avoid:** Either delete `Admin.tsx` or leave it clearly labeled as unused. It doesn't affect production since it's not routed.

---

## Code Examples (Verified Patterns)

### Fix: Remove localStorage from PasswordGate.tsx
```typescript
// REMOVE: remember state, checkbox, localStorage branch
// CHANGE: always use sessionStorage
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!password.trim()) return;
  setError('');
  setLoading(true);
  try {
    await fetchUsage(password);
    sessionStorage.setItem('admin_auth', password);  // always sessionStorage
    onAuth(password);
  } catch {
    setError('Incorrect password');
  } finally {
    setLoading(false);
  }
};
// Remove: const [remember, setRemember] = useState(false);
// Remove: <label>...<input type="checkbox" ...>Remember me</label>
```

### Fix: Remove localStorage from AdminContext.tsx
```typescript
// Line 60 - CHANGE FROM:
const stored = localStorage.getItem('admin_auth') || sessionStorage.getItem('admin_auth');
// TO:
const stored = sessionStorage.getItem('admin_auth');

// Line 113 - REMOVE:
localStorage.removeItem('admin_auth');  // remove this line in signOut
```

### Robots.txt Addition
```
# Admin panel — prevent search indexing
Disallow: /admin
```

### Smoke Test Script (bash)
```bash
#!/bin/bash
BASE="https://cultivatewellnesschiro.com"
AGENT="https://cultivate-agent.drzach.ai"
PASS="${CULTIVATE_ADMIN_PASSWORD}"
FAIL=0

check() {
  local url="$1"
  local expected="${2:-200}"
  local code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "$expected" ]; then
    echo "PASS: $url → $code"
  else
    echo "FAIL: $url → $code (expected $expected)"
    FAIL=1
  fi
}

# Public site routes
check "$BASE/"
check "$BASE/about-us"
check "$BASE/pediatric"
check "$BASE/prenatal"
check "$BASE/family"
check "$BASE/contact-us"
check "$BASE/conditions"
check "$BASE/insight-scans"
check "$BASE/sitemap.xml"
check "$BASE/robots.txt"

# Admin route (SPA — returns 200 with index.html)
check "$BASE/admin"

# API endpoints (Cloudflare Functions)
check "$BASE/api/chat" "405"   # POST only — 405 on GET
check "$BASE/api/form-handler" "405"

# Agent backend health
check "$AGENT/health"

# Agent backend auth (should be 401 without password)
check "$AGENT/api/v1/projects/cultivate-wellness/usage" "401"

# Agent backend auth (should be 200 with correct password)
if [ -n "$PASS" ]; then
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $PASS" "$AGENT/api/v1/projects/cultivate-wellness/usage")
  [ "$code" = "200" ] && echo "PASS: Agent auth → 200" || { echo "FAIL: Agent auth → $code"; FAIL=1; }
fi

echo ""
[ "$FAIL" = "0" ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"
exit $FAIL
```

### Port Conflict Fix (pre-test)
```bash
# 1. Find what's on port 3100
lsof -i :3100

# 2. Kill the Social-Media-Scaling server
kill <PID_OF_WRONG_SERVER>

# 3. Restart agent-backend (if it failed to start)
# The launchd plist should restart it automatically, or manually:
cd ~/Code/agent-backend && npm start

# 4. Verify correct server on port 3100
curl http://localhost:3100/health  # should show uptime, db status, not just {"status":"ok"}
curl -H "Origin: https://cultivatewellnesschiro.com" http://localhost:3100/health  # should return 200
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Deploy detection | Custom webhook or polling | `useDeployPoller` already exists | ETag-based detection is already implemented |
| Smoke tests | Complex test framework | Simple bash script with curl | Simpler, runs without node_modules, easy to paste in terminal |
| Route-level 200 verification | Playwright/Cypress | `curl -o /dev/null -w "%{http_code}"` | No browser setup needed for HTTP status checks |
| CORS debugging | Custom middleware | curl with `-H "Origin: ..."` + server error logs | Faster and more reliable than browser devtools for diagnosis |

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| localStorage "Remember me" | sessionStorage-only (per CONTEXT.md) | Needs code change before deploy |
| Dedicated /admin route | Floating overlay via AdminActivator | Already implemented correctly |
| Manual deploy | GitHub Actions auto-deploy on push to main | Already configured in .github/workflows/deploy.yml |

---

## Open Questions

1. **Helmet Cross-Origin-Resource-Policy conflict**
   - What we know: helmet sets `Cross-Origin-Resource-Policy: same-origin` which can block cross-origin responses at browser level even with correct CORS headers
   - What's unclear: Whether the agent-backend has overridden this header for API routes
   - Recommendation: Test admin panel in browser after fixing port conflict; if CORS errors appear in browser console despite 200 from curl, add `crossOriginResourcePolicy: { policy: 'cross-origin' }` to helmet config in agent-backend's server.ts

2. **Admin.tsx orphaned file**
   - What we know: `src/pages/Admin.tsx` is not routed in App.tsx, contains localStorage references
   - What's unclear: Should it be deleted or kept?
   - Recommendation: Delete it — it's dead code, not routed, uses localStorage which violates the CONTEXT.md decision. Removing it prevents future confusion.

3. **deploy.yml ahead-of-main commit**
   - What we know: `git status` shows "1 commit ahead of origin/main" (the phase context docs commit)
   - What's unclear: Will pushing this stale docs commit trigger a production deploy unintentionally?
   - Recommendation: Yes, pushing will trigger auto-deploy via GitHub Actions. This is safe since the commit only adds .planning/ docs (no source code changes). But the subsequent admin code fixes (sessionStorage, robots.txt) should be committed and pushed in a single clean commit to deploy the admin panel changes.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `src/components/admin/PasswordGate.tsx` — confirmed localStorage issue
- Direct codebase inspection: `src/contexts/AdminContext.tsx` — confirmed localStorage rehydration
- Direct codebase inspection: `src/components/AdminActivator.tsx` — confirmed overlay architecture
- Direct codebase inspection: `src/hooks/useDeployPoller.ts` — confirmed ETag-based detection
- Direct codebase inspection: `src/components/admin/constants.ts` — DEPLOY_COUNTDOWN_SECONDS = 90
- Live environment: `lsof -i :3100` — confirmed wrong server (PID 84267) on port 3100
- Live environment: `ps -p 84267 -o command` — confirmed Social-Media-Scaling/admin/packages/backend
- Live environment: `cat ~/Code/agent-backend/data/projects.json` — confirmed cultivate-wellness origins
- Live environment: `curl https://cultivatewellnesschiro.com/` → 200 confirmed
- Live environment: `cat ~/Code/agent-backend/logs/server.log` — confirmed origins loaded correctly at startup
- Live environment: `cat ~/.cloudflared/config.yml` — confirmed tunnel routes cultivate-agent.drzach.ai → localhost:3100

### Secondary (MEDIUM confidence)
- Cloudflare Pages deploy timing: ~60-120s typical based on deployment logs in STATE.md and community knowledge

---

## Metadata

**Confidence breakdown:**
- Current environment state: HIGH — verified via live curl and process inspection
- Port conflict root cause: HIGH — directly identified via lsof and ps
- Code fix requirements: HIGH — inspected source files directly
- Deploy poller behavior: HIGH — read useDeployPoller.ts source
- Smoke test timing: MEDIUM — Cloudflare deploy times vary

**Research date:** 2026-02-20
**Valid until:** 2026-03-06 (stable architecture, 2 weeks)

---

## Critical Pre-Conditions for Testing

Before any testing can begin, these must be true:

1. **Port 3100 belongs to agent-backend** — `lsof -i :3100 | grep agent-backend`
2. **Agent-backend accepts production origin** — `curl -H "Origin: https://cultivatewellnesschiro.com" http://localhost:3100/health` returns 200
3. **localStorage removed from auth** — Code changes deployed to dev server
4. **Dev server running** — `http://localhost:5173` accessible
