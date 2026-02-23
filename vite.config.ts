import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE } from './src/data/site';

const siteUrl = `https://www.${SITE.domain}`;
const agentUrl = SITE.deployment.agentBackendUrl;
const ga4Id = SITE.deployment.ga4MeasurementId;

// Build the GA4 script block (empty string if no measurement ID)
const ga4Script = ga4Id
  ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4Id}');
    </script>`
  : `<!-- GA4: No measurement ID configured -->`;

// Build CSP connect-src with optional agent backend
const connectSrc = agentUrl
  ? `'self' http://localhost:3100 ${agentUrl}`
  : `'self'`;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/%GA4_SCRIPT%/g, ga4Script)
          .replace(/%SITE_NAME%/g, SITE.name)
          .replace(/%SITE_DESCRIPTION%/g, SITE.description)
          .replace(/%SITE_URL%/g, siteUrl)
          .replace(/%SITE_OG_IMAGE%/g, `${siteUrl}${SITE.images.ogImage}`)
          .replace(/%SITE_THEME_COLOR%/g, SITE.colors.themeColor)
          .replace(/%SITE_CITY%/g, SITE.address.city)
          .replace(/%SITE_REGION%/g, SITE.address.region);
      },
    },
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-DNS-Prefetch-Control', 'off');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
          res.setHeader(
            'Content-Security-Policy',
            `default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src ${connectSrc}; frame-ancestors 'none'`
          );
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: `https://${SITE.domain}`,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
