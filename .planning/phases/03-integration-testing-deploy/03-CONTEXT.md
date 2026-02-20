# Phase 3: Integration Testing + Deploy - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify end-to-end admin panel functionality across local and production environments, then deploy with confidence. No new features — confirm everything from Phases 1–2 works as a complete system.

</domain>

<decisions>
## Implementation Decisions

### Test Strategy
- Claude picks the right mix of automated API tests and manual verification
- Full round-trip testing required: send a real edit command through admin chat, verify the file changes, then revert — proves the whole pipeline end-to-end
- All tests must pass before deploying — no shipping broken admin
- Test on both localhost (dev server) AND production domain (cultivatewellnesschiro.com)

### Deployment Process
- Claude picks the safest deploy approach (direct push vs feature branch + PR)
- Post-deploy verification via automated smoke test — script hits key endpoints and reports pass/fail
- Local Mac + Cloudflare tunnel uptime is fine for now — no additional monitoring needed
- If deploy pipeline fails: fix the issue and retry (no rollback-first approach)

### Admin Access Security
- /admin route with password gate is sufficient — no need to obscure the URL
- Access: Dr. Zach primary, may share with a trusted assistant eventually — single password fine for now
- Session storage only — no localStorage persistence. Require re-login on every tab close
- Exclude /admin from search engine indexing — add noindex meta tag or robots.txt disallow rule

### Regression Scope
- Check ALL public features: chatbot, contact form, guide downloads, all service pages, condition pages
- Hit every route and confirm 200 status — content spot-check on key pages only
- Verify SEO elements: Schema.org JSON-LD, meta tags, sitemap intact
- If regression found post-deploy: hotfix immediately — public site is the priority

### Claude's Discretion
- Exact automated vs manual test split
- Deploy approach (direct push vs PR)
- Loading skeleton and error state details
- Test execution order and parallelization strategy

</decisions>

<specifics>
## Specific Ideas

- Full round-trip test: admin chat sends edit command → file changes → verify → revert. This proves the entire pipeline (frontend → agent backend → Claude → git → deploy).
- Automated smoke test post-deploy should cover: home page, /admin, API health, key service pages, contact form endpoint, chatbot endpoint.
- Session-only auth means the "Remember me" checkbox in PasswordGate should be removed or changed to sessionStorage only.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-integration-testing-deploy*
*Context gathered: 2026-02-20*
