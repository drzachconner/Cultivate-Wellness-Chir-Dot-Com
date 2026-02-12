# Cultivate Wellness Chiropractic Website

## Project Overview
Chiropractic clinic website for Dr. Zach Conner. React + TypeScript + Vite + Tailwind CSS. Hosted on Netlify with serverless functions.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 7
- **Serverless**: Netlify Functions (form-handler.ts, chat.ts)
- **APIs**: OpenAI GPT-5 Mini (AI chatbot), Resend (email), Brevo (email marketing)
- **SSG**: Custom Puppeteer prerender script (scripts/prerender.js)
- **Deployment**: Netlify, auto-deploy from `main` branch

## Key Architecture
- `src/data/site.ts` — Single source of truth for all business info, contacts, hours, testimonials
- `src/lib/schema.ts` — Schema.org structured data generators (driven by site.ts)
- `netlify/functions/form-handler.ts` — Contact form + guide download email handler
- `netlify/functions/chat.ts` — AI chatbot powered by OpenAI (GPT-5 Mini)
- All pages lazy-loaded via React.lazy() in App.tsx

## Brand Colors (Tailwind)
- `primary-dark`: #002d4e (navy) — primary buttons, headers
- `primary`: #6383ab (soft blue)
- `primary-light`: #73b7ce (sky blue)
- `primary-accent`: #405e84 (medium blue) — hover states

## Netlify Config
- **Site ID**: 0fe9f7a6-39a7-4692-b98d-c4b8d7a4157e
- **Site name**: cultivatewellnesschiro
- **URL**: www.cultivatewellnesschiro.com
- **GitHub**: github.com/drzachconner/Cultivate-Wellness-Chir-Dot-Com
- **Build command**: Currently `npm run build` (was `npm run build:ssg` but changed to skip Puppeteer prerender)
- **Functions dir**: netlify/functions
- **Env vars needed on Netlify**: OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY, NOTIFICATION_EMAIL

## Current Status (Feb 9, 2026)

### BROKEN: Netlify build failing with exit code 2
Three consecutive failed deploys:
- `681f100` — "Build script returned non-zero exit code: 2" (plain `npm run build`)
- `1f16fa3` — "Build script returned non-zero exit code: 2"
- `85caf8b` — "Command did not finish within the time limit" (was using `build:ssg` with Puppeteer)

The last successful deploy was **Today at 6:00 AM** (before our changes).

**Root cause**: Unknown. Need to pull the Netlify build log to see the actual Vite error. Exit code 2 from Vite typically means a TypeScript or import error.

**Suspect**: The commit included pre-existing uncommitted changes from before the cleanup session (files modified by a previous Claude model). The `sed` batch replacements for emerald->brand colors also touched many files. Some of these may have introduced issues.

### What was done in cleanup session:
1. Added GA4 Measurement ID (G-049Q1RESRW) to index.html
2. Fixed dead `/3-steps-transition` link → `/free-guides-for-parents`
3. Converted `<a href>` to React Router `<Link>` in Home.tsx, AboutUs.tsx, MobileCTA.tsx, AnswerHub.tsx
4. Deleted dead code: mock-contact-api.ts, MergerPopup.tsx
5. Removed unused deps: @supabase/supabase-js, react-snap; moved resend to devDeps
6. Replaced ALL emerald-* Tailwind classes with brand colors across ~15 files
7. Fixed hardcoded #053e67 in MergerNotification → #002d4e
8. Fixed theme-color in index.html, site.webmanifest, site.ts from green to navy
9. Fixed notification email color from green to brand blue
10. Restricted CORS on both Netlify functions to cultivatewellnesschiro.com
11. Renamed package from vite-react-typescript-starter to cultivate-wellness-chiro
12. Regenerated package-lock.json
13. Changed netlify.toml build command from `build:ssg` to `build` to skip Puppeteer

## Netlify MCP
- Netlify MCP is available but disabled by default to save context
- Enable via `/mcp` when troubleshooting deploys, setting env vars, or managing site config
- Disable after use

### Still TODO after fixing the build:
- Rotate API keys (Groq, Resend, Brevo) — current ones in .env may be exposed in git history
- Re-enable SSG prerendering once basic build works (change build command back to `build:ssg`)
- Verify chatbot and contact form work after CORS restriction
- Data inconsistency: site.ts still has old Rochester Hills address, but merger notification references new Royal Oak location
