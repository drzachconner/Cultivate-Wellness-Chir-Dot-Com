# Technology Stack

**Analysis Date:** 2026-02-19

## Languages

**Primary:**
- TypeScript 5.5.3 - Frontend components, serverless functions, configuration
- JavaScript (ES2020+) - Build scripts, configuration files

**Secondary:**
- HTML5 - Template structure (React/JSX renders to HTML)
- CSS (Tailwind) - Styling via utility classes

## Runtime

**Environment:**
- Node.js 20 - Development and build time (specified in GitHub Actions)

**Package Manager:**
- npm - Dependency management
- Lockfile: `package-lock.json` (present, inferred from `npm ci` in CI/CD)

## Frameworks

**Core:**
- React 18.3.1 - Frontend UI library with hooks
- React Router 7.9.4 - Client-side routing with lazy-loaded pages
- Vite 7.3.1 - Frontend build tool and dev server with HMR

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.4.35 - CSS transformations for Tailwind
- Autoprefixer 10.4.18 - Vendor prefixes for cross-browser support

**Icons:**
- lucide-react 0.344.0 - SVG icon library

**SEO & Metadata:**
- react-helmet-async 2.0.5 - Managing document head (title, meta tags)

**Serverless:**
- Cloudflare Pages Functions - Request handlers for `/api/*` endpoints
- Cloudflare Pages - Static site hosting with auto-deploy

## Key Dependencies

**Critical:**
- resend 6.9.1 - Transactional email SDK (contact forms, guide delivery)
- OpenAI API - External dependency for AI chatbot (called via fetch to https://api.openai.com/v1/chat/completions)
- Brevo API - External dependency for email marketing list management (called via fetch to https://api.brevo.com/v3/contacts)

**Development & Build:**
- typescript-eslint 8.3.0 - TypeScript linting
- @eslint/js 9.9.1 - ESLint base configuration
- eslint-plugin-react-hooks 5.1.0-rc.0 - React hooks lint rules
- eslint-plugin-react-refresh 0.4.11 - React Fast Refresh lint rules
- @vitejs/plugin-react 5.1.4 - Vite React JSX plugin
- puppeteer 24.37.2 - Headless browser for SSG prerendering (currently disabled)

**Infrastructure:**
- @types/react 18.3.5 - TypeScript definitions for React
- @types/react-dom 18.3.0 - TypeScript definitions for React DOM
- globals 15.9.0 - Global variable definitions for linting

## Configuration

**Environment:**
- Cloudflare Pages environment variables (set in Pages dashboard):
  - `OPENAI_API_KEY` - OpenAI API authentication
  - `RESEND_API_KEY` - Resend email service authentication
  - `BREVO_API_KEY` - Brevo email list management authentication
  - `NOTIFICATION_EMAIL` - Email recipient for form notifications
- GitHub Secrets (for CI/CD):
  - `CLOUDFLARE_API_TOKEN` - Cloudflare API authentication
  - `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account identifier

**Build:**
- `vite.config.ts` - Vite configuration with React plugin and security headers middleware
- `tsconfig.json` - TypeScript project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tailwind.config.js` - Tailwind theme extensions (custom brand colors, font families)
- `wrangler.toml` - Cloudflare Pages configuration with Node.js compatibility flag

**Deployment:**
- `.github/workflows/deploy.yml` - GitHub Actions workflow
  - Trigger: Push to `main` branch
  - Build: Node 20, `npm ci`, `npm run build`
  - Deploy: Wrangler CLI to Cloudflare Pages project `cultivate-wellness-chiro`

## Platform Requirements

**Development:**
- Node.js 20+
- npm 9+
- Modern terminal (bash/zsh)
- Git

**Production:**
- Cloudflare Pages (serverless hosting)
- Cloudflare account with Pages enabled
- Domain DNS pointing to Cloudflare nameservers
- Custom domains: cultivatewellnesschiro.com, www.cultivatewellnesschiro.com

**Runtime Environment:**
- Cloudflare Edge Network (v8 isolate with Node.js compatibility flag)
- Compatibility date: 2024-09-23

## Build & Deployment Pipeline

**Development:**
```bash
npm run dev          # Vite dev server with HMR
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint validation
```

**Production:**
```bash
npm run build        # Vite production build to dist/
# npm run build:ssg  # Optional: SSG prerendering (currently disabled)
```

**CI/CD:**
1. Push to main triggers GitHub Actions workflow
2. Checkout code and setup Node 20
3. Install dependencies via `npm ci`
4. Build with `npm run build`
5. Deploy to Cloudflare Pages using Wrangler with project credentials

## Optional Technologies (Not Currently Active)

- **SSG Prerendering:** Puppeteer script (`scripts/prerender.js`) for static generation - build command `npm run build:ssg` currently disabled pending verification

---

*Stack analysis: 2026-02-19*
