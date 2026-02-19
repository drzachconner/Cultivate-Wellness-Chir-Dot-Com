# External Integrations

**Analysis Date:** 2026-02-19

## APIs & External Services

**AI/Chatbot:**
- OpenAI GPT-4.1 (GPT-5 Mini in documentation) - AI chatbot on website
  - Endpoint: `https://api.openai.com/v1/chat/completions`
  - SDK/Client: Direct fetch with Bearer token authentication
  - Auth env var: `OPENAI_API_KEY`
  - Implementation: `functions/api/chat.ts`
  - Rate limiting: 60 requests per minute per IP
  - Request format: JSON POST with message history (last 10 messages kept for context)
  - Response: JSON with assistant reply
  - Model: `gpt-4.1`
  - Temperature: 0.7
  - Max tokens: 1024

**Email Services:**
- Resend - Transactional email delivery
  - SDK/Client: `resend` npm package v6.9.1
  - Auth env var: `RESEND_API_KEY`
  - Implementation: `functions/api/form-handler.ts`
  - Use cases:
    - Contact form notifications to site owner
    - Appointment request notifications
    - Guide download auto-responses to users
    - Workshop signup notifications
  - Email domains: `forms@cultivatewellnesschiro.com`, `guides@cultivatewellnesschiro.com`
  - Rate limiting: 10 requests per minute per IP (form submissions)

- Brevo (formerly Sendinblue) - Email marketing list management
  - Endpoint: `https://api.brevo.com/v3/contacts`
  - SDK/Client: Direct fetch with API-key header authentication
  - Auth env var: `BREVO_API_KEY`
  - Implementation: `functions/api/form-handler.ts`
  - Use case: Add contacts to marketing list on form submission (auto-sync)
  - Default list ID: 2
  - Attributes synced: Email, first name (FIRSTNAME)
  - Update enabled: Yes (existing contacts updated, not duplicated)

## Data Storage

**Databases:**
- Not detected - No database integration in current stack

**File Storage:**
- Local filesystem (public/) - Static site assets
  - PDFs: `/public/guides/` directory
    - `raising-healthy-kids-naturally.pdf`
    - `3-ways-to-sleep.pdf`
    - `3-ways-to-poop.pdf`
  - Images: `/public/images/` directory
  - Configuration files: `/public/_headers`, `/public/_redirects`, `sitemap.xml`, `robots.txt`
- Cloudflare Pages native caching for static assets

**Caching:**
- Cloudflare Pages edge caching (HTTP caching headers via `public/_headers`)
- No application-level caching layer (Redis, memcached, etc.)
- Cloudflare Workers isolate persistence (ephemeral in-memory rate-limiting map)

## Authentication & Identity

**Auth Provider:**
- None for user authentication
- Service-to-service API authentication via bearer tokens and API keys only

**Security Measures:**
- CORS validation: Hardcoded origin allowlist in `functions/api/chat.ts` and `functions/api/form-handler.ts`
  - Allowed: `https://www.cultivatewellnesschiro.com`, `https://cultivatewellnesschiro.com`
- Rate limiting: Custom in-memory rate limiter (`functions/lib/rate-limit.ts`)
  - Chat endpoint: 60 requests/minute per IP
  - Form endpoint: 10 requests/minute per IP
  - IP extraction: CF-Connecting-IP or X-Forwarded-For header
- Input validation in form handler:
  - Email regex validation
  - Name length limit: 200 characters
  - Message length limit: 5000 characters
  - Chat message length limit: 2000 characters per message
- HTML entity escaping in notification emails to prevent injection

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, LogRocket, or similar integration

**Logs:**
- Cloudflare Pages function logs (console.error/console.log)
- No structured logging framework
- Error handling: Basic try-catch with error responses and console logging

**Observability:**
- Cloudflare Pages dashboard metrics (requests, errors, latency)
- Manual monitoring via email notifications (form submissions trigger owner emails)

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages (serverless static + functions)
  - Project name: `cultivate-wellness-chiro`
  - Pages URL: `cultivate-wellness-chiro.pages.dev`
  - Custom domains: `cultivatewellnesschiro.com`, `www.cultivatewellnesschiro.com` (both live, SSL enabled)
  - Zone ID: `00d364c0d7d8bae4f050fc53e14a2ffb`
  - Cloudflare account ID: `a353a0ba5d6753a262466e799f1d960c`

**Domain Management:**
- Domain registrar: Squarespace (ownership)
- DNS: Cloudflare (nameservers updated Feb 2026)
- SSL/TLS: Automatic via Cloudflare

**CI Pipeline:**
- GitHub Actions (`.github/workflows/deploy.yml`)
- Trigger: Push to `main` branch
- Environment: Ubuntu latest
- Steps:
  1. Checkout code
  2. Setup Node 20
  3. Install dependencies: `npm ci`
  4. Build: `npm run build`
  5. Deploy: Cloudflare Wrangler action
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Build output directory: `dist/`
- Functions directory: `functions/` (auto-detected)

## Environment Configuration

**Required env vars:**

| Variable | Purpose | Sensitivity |
|----------|---------|-------------|
| `OPENAI_API_KEY` | OpenAI API authentication | Sensitive - Secret |
| `RESEND_API_KEY` | Resend transactional email | Sensitive - Secret |
| `BREVO_API_KEY` | Brevo email marketing | Sensitive - Secret |
| `NOTIFICATION_EMAIL` | Contact form recipient | Non-sensitive |
| `CLOUDFLARE_API_TOKEN` | Cloudflare deployment auth | Sensitive - Secret (GitHub) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | Non-sensitive |

**Configuration location:**
- Production env vars: Cloudflare Pages dashboard (environment section)
- CI/CD secrets: GitHub repository secrets
- Development: `.env` file (in `.gitignore`, not committed)

**Secrets location:**
- All API keys stored in Cloudflare Pages environment variables (dashboard)
- GitHub Actions secrets for deployment credentials
- Git history may contain exposed keys - rotation recommended

## Webhooks & Callbacks

**Incoming:**
- None detected - No inbound webhook endpoints from external services

**Outgoing:**
- Form submissions trigger email webhooks:
  - Contact form → Resend (transactional) + Brevo (list sync)
  - Guide download → Resend (auto-response) + Brevo (list sync)
  - Appointment request → Resend (notification)
  - Workshop signup → Resend (notification)
- No webhooks to external systems (fire-and-forget email calls only)

**Email Events:**
- No webhook handling for Resend or Brevo delivery/bounce events
- No bounce or complaint processing

## Third-Party Services Summary

| Service | Purpose | Critical | Fallback |
|---------|---------|----------|----------|
| OpenAI | Chatbot AI | Yes | None - unavailable if down |
| Resend | Email delivery | Yes | None - form notifications fail silently |
| Brevo | Email marketing sync | No | Graceful error handling (try-catch) |
| Cloudflare | Hosting + DNS | Yes | Requires migration to new host |
| GitHub | CI/CD + code hosting | Yes | Manual deployment required |

## Known Service Dependencies

- **Hard dependency:** OpenAI (chatbot unavailable if API down)
- **Hard dependency:** Resend (contact form notifications fail if API down)
- **Soft dependency:** Brevo (contact form succeeds but list sync fails gracefully)
- **Hard dependency:** Cloudflare Pages (site unavailable if platform down)

---

*Integration audit: 2026-02-19*
