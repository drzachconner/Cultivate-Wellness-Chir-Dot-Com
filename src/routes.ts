// All routes for SSG pre-rendering
// Generated from SITE.pages config + conditions data
import { SITE } from './data/site';
import { getAllConditions } from './data/conditions';

export const routes = [
  // Shared routes (identical across all sites)
  '/',
  '/about-us',
  '/pediatric',
  '/prenatal',
  '/family',
  '/new-patient-center',
  '/new-patient-forms',
  '/request-an-appointment',
  '/schedule-appointment',
  '/book-appointment',
  '/events-workshops',
  '/contact-us',
  '/privacy',
  '/thanks',
  '/3-ways-to-poop',
  '/rhkn-guide',
  '/3-ways-to-sleep',
  '/free-guides-for-parents',
  '/talsky-tonal-chiropractic',
  '/answers',
  '/thank-you-for-your-submission',

  // Dynamic: Doctor page
  SITE.pages.doctor.slug,

  // Dynamic: Technique pages (excluding TalskyTonal which is shared above)
  ...SITE.pages.techniques
    .filter((t) => t.slug !== '/talsky-tonal-chiropractic')
    .map((t) => t.slug),

  // Dynamic: Site-specific pages
  ...SITE.pages.siteSpecific.map((p) => p.slug),

  // Conditions (data-driven)
  '/conditions',
  ...getAllConditions().map((c) => `/conditions/${c.slug}`),
];
