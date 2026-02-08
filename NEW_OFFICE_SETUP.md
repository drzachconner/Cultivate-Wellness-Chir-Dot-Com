# New Office Website Setup Guide

This guide walks through setting up a new chiropractic office website using this template.

## Overview

This template is a config-driven system. Most office-specific information lives in a single file: `src/data/site.ts`. Updating this file (plus replacing images) is 90% of the work.

## Quick Start Checklist

- [ ] Clone this repository to a new repo for the office
- [ ] Update `src/data/site.ts` with office details
- [ ] Update `index.html` meta tags
- [ ] Replace images in `public/images/`
- [ ] Update environment variables
- [ ] Update static SEO files (robots.txt, sitemap.xml, llms.txt)
- [ ] Test all pages
- [ ] Deploy

---

## Step 1: Clone Repository

```bash
# Clone template to new office repo
git clone <template-repo-url> <new-office-name>
cd <new-office-name>

# Remove git history and reinitialize
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Add new remote
git remote add origin <new-office-repo-url>
git push -u origin main
```

---

## Step 2: Update Site Configuration

Edit `src/data/site.ts` with the new office's information:

### Business Identity
```typescript
name: 'New Office Name Chiropractic',
shortName: 'New Office Name',
domain: 'newoffice.com',
description: 'Office tagline/description for SEO',
tagline: 'Visible tagline on site',
foundingYear: '2024',
```

### Doctor Information
```typescript
doctor: {
  fullName: 'Dr. Jane Smith',
  firstName: 'Jane',
  lastName: 'Smith',
  honorificPrefix: 'Dr.',
  honorificSuffix: 'DC',
  credentials: 'DC, CACCP',
  title: 'Doctor of Chiropractic',
  bio: 'Dr. Jane specializes in...',
  education: 'Palmer College of Chiropractic',
  educationWikidata: 'https://www.wikidata.org/wiki/Q7127892',
  image: '/images/doctor.webp',
  pageSlug: '/meet-dr-jane',  // Update route if name changes
  schemaId: 'dr-jane',
  expertise: [...],
  certifications: [...],
}
```

### Contact Information
```typescript
phone: '+1-555-123-4567',
phoneDisplay: '(555) 123-4567',
email: 'info@newoffice.com',
```

### Address & Location
```typescript
address: {
  street: '123 Main St., Ste. 100',
  city: 'City Name',
  region: 'ST',
  postal: '12345',
  country: 'US',
  formatted: '123 Main St., Ste. 100, City Name, ST 12345',
},
geo: {
  latitude: 40.7128,
  longitude: -74.0060,
},
googlePlaceId: 'ChIJ...',  // Get from Google Maps
```

### Business Hours
```typescript
hours: {
  display: ['Monday 9:00 AM - 5:00 PM', 'Wednesday 9:00 AM - 5:00 PM'],
  shortFormat: ['Mo 09:00-17:00', 'We 09:00-17:00'],
  structured: [
    { dayOfWeek: 'Monday', opens: '09:00', closes: '17:00' },
    { dayOfWeek: 'Wednesday', opens: '09:00', closes: '17:00' },
  ],
},
```

### Booking System
```typescript
booking: {
  provider: 'jane',  // or 'calendly', 'acuity', etc.
  url: 'https://newoffice.janeapp.com/',
  urlWithUtm: 'https://newoffice.janeapp.com/?utm_source=website&utm_medium=cta&utm_campaign=request-appointment',
},
// Also update legacy aliases:
janeUrl: 'https://newoffice.janeapp.com/',
janeUrlWithUtm: '...',
```

### Contact Form
```typescript
contactForm: {
  provider: 'formspree',  // Changed from supabase
  formspreeId: 'xxxxxxxx',  // Get from formspree.io
  recipientEmail: 'info@newoffice.com',
},
```

### Social Media
```typescript
socials: {
  facebook: 'https://facebook.com/NewOffice',
  instagram: 'https://instagram.com/newoffice',
  tiktok: '',  // Leave empty if not used
  youtube: '',
  linkedin: '',
  twitter: '',
  pinterest: '',
},
```

### Testimonials
Replace with real testimonials from the new office:
```typescript
testimonials: [
  {
    id: 1,
    name: 'Patient Name',
    text: 'Review text...',
    rating: 5,
    datePublished: '2024-01-15',
  },
  // Add more...
],
```

### Features Toggle
Enable/disable features based on what the office offers:
```typescript
features: {
  talskyTonal: false,      // Only if they practice this technique
  insightScans: true,      // If they have INSiGHT equipment
  eventsWorkshops: false,  // If they offer workshops
  freeGuides: false,       // If they have downloadable guides
},
```

---

## Step 3: Update index.html

These values must be updated manually in `index.html`:

```html
<!-- Line 10: Default description -->
<meta name="description" content="New office description here" />

<!-- Line 13: Site name for Open Graph -->
<meta property="og:site_name" content="New Office Name Chiropractic" />

<!-- Line 16: Browser title -->
<title>New Office Name Chiropractic</title>
```

---

## Step 4: Replace Images

Replace these files in `public/images/`:

| File | Description | Recommended Size |
|------|-------------|------------------|
| `logo.webp` | Office logo | 200x80px |
| `doctor.webp` or `dr-*.webp` | Doctor headshot | 600x800px |
| `hero-family.webp` | Main hero image | 1920x1080px |
| `contact-hero.webp` | Contact page hero | 1920x600px |
| `family-adjustment.webp` | Service image | 800x600px |
| `pediatric-care.webp` | Service image | 800x600px |
| `og-image.jpg` | Social sharing image | 1200x630px |
| `favicon.ico` / `favicon.webp` | Browser icon | 32x32px, 180x180px |

**Image naming convention:**
- Doctor image: Name it to match `SITE.doctor.image` path
- Update image references in `SITE.images` if you use different names

---

## Step 5: Update Environment Variables

Create/update `.env`:

```bash
# For Supabase contact form (if using)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# For production
NODE_ENV=production
```

### Setting Up Formspree (Recommended for New Offices)

1. Go to [formspree.io](https://formspree.io)
2. Create a new form
3. Copy the form ID (e.g., `xyzabc12`)
4. Add to `site.ts`:
   ```typescript
   contactForm: {
     provider: 'formspree',
     formspreeId: 'xyzabc12',
   }
   ```
5. Update `src/components/ContactForm.tsx` to use Formspree (see below)

### ContactForm.tsx for Formspree

Replace the Supabase submission logic with:
```typescript
const response = await fetch(`https://formspree.io/f/${SITE.contactForm.formspreeId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

---

## Step 6: Update Static SEO Files

### public/robots.txt
Update domain references:
```
Sitemap: https://newoffice.com/sitemap.xml
Host: https://newoffice.com
```

### public/sitemap.xml
Regenerate with correct domain. The build script should handle this, but verify all URLs use the new domain.

### public/llms.txt
Update with new office information.

### public/site.webmanifest
Update name and short_name:
```json
{
  "name": "New Office Name Chiropractic",
  "short_name": "New Office"
}
```

### public/llms.txt
This file helps AI assistants understand the site. Update:
- Practice name and description
- Doctor name and credentials
- Contact information
- Service descriptions
- Social media links

---

## Step 7: Update Routes (If Needed)

If the doctor's name changes the URL slug, update `src/routes.ts`:

```typescript
// Change:
'/meet-dr-zach': 'Meet Dr. Zach',
// To:
'/meet-dr-jane': 'Meet Dr. Jane',
```

Also update any internal links referencing the old URL.

---

## Step 8: Remove Office-Specific Pages

If the new office doesn't offer certain services, remove or redirect these pages:

- `/talsky-tonal-chiropractic` - If they don't practice this technique
- `/insight-scans` - If they don't have the equipment
- `/events-workshops` - If they don't offer workshops
- `/free-guides-for-parents` - If they don't have guides
- Individual guide pages (`/3-ways-to-poop`, etc.)

Update `src/App.tsx` and `src/routes.ts` accordingly.

---

## Step 9: Test Everything

### Build Test
```bash
npm install
npm run build
npm run preview
```

### Pages to Verify
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Booking links redirect correctly
- [ ] Doctor page shows correct info
- [ ] Footer shows correct address/phone
- [ ] Social links work
- [ ] Mobile responsive layout works

### SEO Verification
- [ ] View page source - check `<title>` tag
- [ ] Check Open Graph meta tags (use [Facebook Debugger](https://developers.facebook.com/tools/debug/))
- [ ] Check JSON-LD structured data (use [Google Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Verify sitemap.xml is accessible
- [ ] Test robots.txt

---

## Step 10: Deploy

### Recommended Hosting
- Vercel (automatic SSL, easy setup)
- Netlify
- Cloudflare Pages

### Deployment Checklist
- [ ] Set environment variables in hosting platform
- [ ] Configure custom domain
- [ ] Verify SSL certificate
- [ ] Test production build
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Google

---

## Content Extraction (When Given Existing Website)

If setting up from an existing website, use the extraction workflow:

### Information to Extract
1. **Business Details**
   - Office name
   - Doctor name(s) and credentials
   - Address (verify with Google Maps for geo coordinates)
   - Phone number
   - Email
   - Hours of operation

2. **Social Media**
   - Facebook page URL
   - Instagram handle
   - Other social profiles

3. **Copy/Content**
   - About page bio
   - Service descriptions
   - Testimonials (with patient names and dates if available)

4. **Images**
   - Doctor headshot
   - Logo
   - Office photos
   - Any unique imagery

### Using the Extraction Script
```bash
node scripts/extract-content.js https://existing-site.com
```

This will create a JSON file with extracted information you can use to populate `site.ts`.

---

## Troubleshooting

### TypeScript Errors After Config Changes
Run type check to identify issues:
```bash
npm run typecheck
```

### Images Not Loading
- Verify file paths match `SITE.images` values
- Check file extensions (webp vs jpg)
- Ensure images are in `public/images/`

### Schema.org Errors
Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate structured data.

### Contact Form Not Working
- For Formspree: Verify form ID is correct
- For Supabase: Check environment variables and edge function deployment

---

## File Reference

### Must Update
| File | What to Update |
|------|----------------|
| `src/data/site.ts` | All office information |
| `index.html` | Title, og:site_name, description |
| `public/images/*` | All images |
| `.env` | Environment variables |

### May Need Updates
| File | When to Update |
|------|----------------|
| `src/routes.ts` | If doctor page URL changes |
| `src/App.tsx` | If removing/adding pages |
| `public/robots.txt` | Domain references |
| `public/sitemap.xml` | Domain references |
| `tailwind.config.js` | If brand colors change |

### Auto-Generated from Config
| File | Source |
|------|--------|
| `src/lib/schema.ts` | Uses SITE config |
| `src/components/Footer.tsx` | Uses SITE config |
| `src/components/Seo.tsx` | Uses SITE config via useSeo hook |
| `src/hooks/useSeo.ts` | Uses SITE config |
| All page SEO | Uses SITE config |

### Key Components
| Component | Purpose |
|-----------|---------|
| `src/components/Seo.tsx` | SEO meta tags (uses react-helmet-async) |
| `src/components/JsonLd.tsx` | Structured data injection |
| `src/components/Breadcrumbs.tsx` | Breadcrumb navigation |
| `src/routes.ts` | Centralized route definitions for SSG |

### SSG/Hydration
The site uses Vite + Puppeteer for static site generation:
- `main.tsx` detects pre-rendered content and hydrates instead of full render
- `scripts/prerender.js` generates static HTML for all routes
- Build command: `npm run build:ssg`

### AI Discovery
| File | Purpose |
|------|---------|
| `public/llms.txt` | AI-readable site summary (llmstxt.org spec) |
| `public/robots.txt` | Allows AI crawlers (GPTBot, ClaudeBot, etc.) |
