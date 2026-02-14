# Cultivate Wellness Chiropractic Website

## Project Overview
Chiropractic clinic website for Dr. Zach Conner. React + TypeScript + Vite + Tailwind CSS. Hosted on Cloudflare Pages with Pages Functions.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 7
- **Serverless**: Cloudflare Pages Functions (functions/api/form-handler.ts, functions/api/chat.ts)
- **APIs**: OpenAI GPT-5 Mini (AI chatbot), Resend (email), Brevo (email marketing)
- **SSG**: Custom Puppeteer prerender script (scripts/prerender.js)
- **Deployment**: Cloudflare Pages, auto-deploy from `main` branch

## Key Architecture
- `src/data/site.ts` — Single source of truth for all business info, contacts, hours, testimonials
- `src/lib/schema.ts` — Schema.org structured data generators (driven by site.ts)
- `functions/api/form-handler.ts` — Contact form + guide download email handler (Cloudflare Pages Function)
- `functions/api/chat.ts` — AI chatbot powered by OpenAI (Cloudflare Pages Function)
- All pages lazy-loaded via React.lazy() in App.tsx

## Brand Colors (Tailwind)
- `primary-dark`: #002d4e (navy) — primary buttons, headers
- `primary`: #6383ab (soft blue)
- `primary-light`: #73b7ce (sky blue)
- `primary-accent`: #405e84 (medium blue) — hover states

## Cloudflare Pages Config
- **Project name**: cultivate-wellness-chiro
- **Pages URL**: cultivate-wellness-chiro.pages.dev
- **Custom domains**: cultivatewellnesschiro.com, www.cultivatewellnesschiro.com
- **Domain registrar**: Squarespace (nameservers updated to Cloudflare Feb 2026)
- **GitHub**: github.com/drzachconner/Cultivate-Wellness-Chir-Dot-Com
- **Build command**: `npm run build`
- **Build output**: `dist`
- **Functions dir**: `functions/` (auto-detected by Cloudflare Pages)
- **Config file**: `wrangler.toml`
- **Compatibility**: `nodejs_compat` flag, date `2024-09-23`
- **DNS zone**: cultivatewellnesschiro.com (zone ID: 00d364c0d7d8bae4f050fc53e14a2ffb)
- **Cloudflare account ID**: a353a0ba5d6753a262466e799f1d960c
- **Env vars set in Cloudflare Pages**: OPENAI_API_KEY, RESEND_API_KEY, BREVO_API_KEY, NOTIFICATION_EMAIL

## Cloudflare Pages Functions
- Functions use the `onRequestPost` / `onRequestOptions` export pattern
- Env vars accessed via `context.env.VAR_NAME` (not `process.env`)
- Resend SDK instantiated inside handler (env vars come from context)
- Path-based routing: `functions/api/chat.ts` -> `/api/chat`
- `public/_redirects` handles SPA fallback
- `public/_headers` handles security and caching headers

## Still TODO
- Verify chatbot and contact form work on custom domain (SSL provisioning in progress)
- Connect GitHub repo to Cloudflare Pages for auto-deploy (currently manual deploy via wrangler)
- Rotate API keys (Groq, Resend, Brevo) — current ones in .env may be exposed in git history
- Re-enable SSG prerendering once basic build works (change build command back to `build:ssg`)
- Data inconsistency: site.ts still has old Rochester Hills address, but merger notification references new Royal Oak location
- Cancel Netlify subscription after both sites fully verified
