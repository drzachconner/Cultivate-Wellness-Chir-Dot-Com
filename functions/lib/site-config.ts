/**
 * Site-specific configuration for Cloudflare Pages Functions.
 *
 * Pages Functions cannot import from src/, so this file is the bridge
 * between the frontend SITE object and serverless handlers.
 *
 * TIER 3 (unique per site) — never synced by sync-from-template.py
 */

export const SITE_CONFIG = {
  /** Canonical site URL (with www) */
  siteUrl: 'https://www.cultivatewellnesschiro.com',

  /** Allowed CORS origins */
  allowedOrigins: [
    'https://www.cultivatewellnesschiro.com',
    'https://cultivatewellnesschiro.com',
  ],

  /** Email sender display name */
  emailFromName: 'Cultivate Wellness',

  /** Email sender domain (must match Resend verified domain) */
  emailFromDomain: 'cultivatewellnesschiro.com',

  /** Forms sender address */
  emailFromForms: 'Cultivate Wellness <forms@cultivatewellnesschiro.com>',

  /** Guides sender address */
  emailFromGuides: 'Cultivate Wellness Chiropractic <guides@cultivatewellnesschiro.com>',

  /** Fallback notification email (if env var not set) */
  fallbackNotificationEmail: 'zachary.riles.conner@gmail.com',

  /** Logo URL for email templates */
  emailLogoUrl: 'https://www.cultivatewellnesschiro.com/images/cwc-logo-horizontal.webp',

  /** Logo alt text */
  emailLogoAlt: 'Cultivate Wellness Chiropractic',

  /** Brand primary color for email buttons/headings */
  emailBrandColor: '#264b7f',

  /** Email footer tagline */
  emailTagline: 'At Cultivate Wellness Chiropractic we are Experts in Drug-Free Pediatric, Prenatal, and Family Health Care!',

  /** Email footer address block */
  emailFooterAddress: 'Cultivate Wellness Chiropractic<br>Royal Oak, MI',
} as const;
