# Cultivate Wellness Chiropractic Website

## Core Value
Chiropractic clinic website for Dr. Zach Conner, serving pediatric, prenatal, and family patients in Rochester Hills / Royal Oak, MI.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 7
- **Serverless**: Cloudflare Pages Functions (`functions/api/`)
- **APIs**: OpenAI GPT-4.1 (chatbot), Resend (transactional email), Brevo (email marketing)
- **Deployment**: Cloudflare Pages, auto-deploy from `main` via GitHub Actions
- **Domain**: cultivatewellnesschiro.com (Cloudflare DNS)

## Architecture
- `src/data/site.ts` — Single source of truth for all business info
- `src/lib/schema.ts` — Schema.org structured data generators
- `functions/api/form-handler.ts` — Contact form + guide download (Resend + Brevo)
- `functions/api/chat.ts` — AI chatbot (OpenAI)
- `functions/lib/rate-limit.ts` — In-memory rate limiting
- All pages lazy-loaded via React.lazy() in App.tsx
- 47 condition pages generated from structured data in `src/data/conditions/`

## Validated Requirements (Shipped)
- Public website with all service pages (pediatric, prenatal, family)
- 47 condition-specific SEO pages
- AI chatbot (OpenAI GPT-4.1)
- Contact form with Resend email + Brevo list sync
- Free guide downloads with auto-response emails
- Schema.org structured data on all pages
- Mobile-responsive design with Tailwind CSS
- Cloudflare Pages deployment with GitHub Actions CI/CD
- Rate limiting on all API endpoints
- Practice merger notification banner

## Key Decisions
- Cloudflare Pages over Netlify (migrated Feb 2026)
- Single source of truth pattern (site.ts drives everything)
- No database — all content in source files
- No authentication — public site only (admin to be added)

## Current Milestone: v1.1 Admin Dashboard

**Goal:** Add a password-protected /admin dashboard for site management

**Target features:**
- Password-protected admin authentication
- Dashboard shell with navigation
- Content management (site.ts editing)
- Form submission visibility
- Guide download tracking
- Chatbot configuration

*Last updated: 2026-02-19*
