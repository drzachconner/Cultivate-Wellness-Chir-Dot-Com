// integration-test-marker-2026-02-20
/**
 * SITE CONFIGURATION
 *
 * This is the SINGLE SOURCE OF TRUTH for all office-specific information.
 * When setting up a new office website, update this file with the new office's details.
 *
 * See NEW_OFFICE_SETUP.md for complete instructions.
 */

export const SITE = {
  // ============================================
  // BUSINESS IDENTITY
  // ============================================
  name: 'Cultivate Wellness Chiropractic',
  shortName: 'Cultivate Wellness', // Used for alternate name in schema
  domain: 'cultivatewellnesschiro.com',
  description: 'Pediatric, prenatal & family chiropractor in Rochester Hills, MI. Our team provides gentle, neuro-focused care for children and families.',
  tagline: 'Helping Your Family Thrive, Naturally',
  foundingYear: '2020',
  priceRange: '$$',

  // ============================================
  // DOCTOR / PRACTITIONER INFO
  // ============================================
  doctor: {
    fullName: 'Dr. Zach Conner',
    firstName: 'Zach',
    lastName: 'Conner',
    honorificPrefix: 'Dr.',
    honorificSuffix: 'DC',
    credentials: 'DC',
    title: 'Neurologically-Focused Chiropractor',
    bio: 'Our team specializes in family chiropractic care with a focus on pediatric and prenatal wellness. We believe in empowering families through natural, holistic healthcare.',
    education: 'Life University College of Chiropractic',
    educationWikidata: 'https://www.wikidata.org/wiki/Q6545465',
    image: '/images/dr-zach.webp',
    pageSlug: '/meet-dr-zach',
    schemaId: 'dr-zach', // Used for @id in schema.org
    expertise: [
      'Pediatric Chiropractic',
      'Prenatal Chiropractic',
      'Talsky Tonal Chiropractic',
      'Neurological Development',
      'Family Wellness',
      'Webster Technique',
      'INSiGHT Scans',
    ],
    certifications: [
      {
        type: 'degree',
        name: 'Doctor of Chiropractic',
      },
      {
        type: 'certification',
        name: 'ICPA Webster Technique Certification',
      },
    ],
  },

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  phone: '+1-248-221-1118',
  phoneDisplay: '(248) 221-1118',
  email: 'info@cultivatewellnesschiro.com',

  // ============================================
  // PHYSICAL ADDRESS
  // ============================================
  address: {
    street: '1460 Walton Blvd., Ste. 210',
    city: 'Rochester Hills',
    region: 'MI',
    postal: '48309',
    country: 'US',
    // Full formatted address for display
    formatted: '1460 Walton Blvd., Ste. 210, Rochester Hills, MI 48309',
  },

  // ============================================
  // GEOGRAPHIC DATA (for maps & schema.org)
  // ============================================
  geo: {
    latitude: 42.6820301,
    longitude: -83.159966,
  },
  // Google Maps place ID (for sameAs links in schema)
  googlePlaceId: 'ChIJBQUKW2fJJIgRZoaJtd9K7ac',

  // ============================================
  // BUSINESS HOURS
  // ============================================
  hours: {
    // Human-readable format for display
    display: ['Friday 3:00 PM - 6:30 PM', 'Saturday 8:00 AM - 1:00 PM'],
    // Short format for LocalBusiness schema
    shortFormat: ['Fr 15:00-18:30', 'Sa 08:00-13:00'],
    // Structured format for OpeningHoursSpecification schema
    structured: [
      { dayOfWeek: 'Friday', opens: '15:00', closes: '18:30' },
      { dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
    ],
  },

  // ============================================
  // BOOKING SYSTEM
  // ============================================
  booking: {
    provider: 'jane', // 'jane' | 'formspree' | 'calendly' | etc.
    url: 'https://cultivatewellnesschiro.janeapp.com/',
    urlWithUtm: 'https://cultivatewellnesschiro.janeapp.com/?utm_source=website&utm_medium=cta&utm_campaign=request-appointment',
  },

  // Legacy aliases for backwards compatibility (use booking.url/booking.urlWithUtm for new code)
  janeUrl: 'https://cultivatewellnesschiro.janeapp.com/',
  janeUrlWithUtm: 'https://cultivatewellnesschiro.janeapp.com/?utm_source=website&utm_medium=cta&utm_campaign=request-appointment',

  // ============================================
  // CONTACT FORM
  // ============================================
  contactForm: {
    // Options: 'supabase' | 'formspree'
    provider: 'supabase',
    // If using Formspree, set this to your form ID
    formspreeId: null,
    // Email where form submissions are sent (for Supabase)
    recipientEmail: 'info@cultivatewellnesschiro.com',
  },

  // ============================================
  // SOCIAL MEDIA
  // ============================================
  socials: {
    facebook: 'https://facebook.com/CultivateWellnessChiro',
    instagram: 'https://instagram.com/cultivatewellnesschiro',
    tiktok: 'https://tiktok.com/@cultivatewellnesschiro',
    youtube: 'https://youtube.com/@cultivatewellnesschiropractic',
    // Optional - leave empty string if not applicable
    linkedin: '',
    twitter: '',
    pinterest: '',
  },

  // ============================================
  // IMAGES (standardized paths in /public/images/)
  // ============================================
  images: {
    logo: '/images/logo.webp',
    heroFamily: '/images/hero-family.webp',
    doctorHeadshot: '/images/dr-zach.webp',
    contactHero: '/images/contact-hero.webp',
    ogImage: '/images/hero-family.webp', // Default Open Graph image
  },

  // ============================================
  // BRANDING COLORS (update tailwind.config.js to match)
  // ============================================
  colors: {
    themeColor: '#002d4e', // Primary dark (navy)
    primaryDark: '#002d4e',
    primary: '#6383ab',
    primaryLight: '#73b7ce',
    primaryAccent: '#405e84',
  },

  // ============================================
  // SERVICES OFFERED
  // ============================================
  services: [
    {
      id: 'pediatric',
      name: 'Pediatric Chiropractic Care',
      shortName: 'Pediatric',
      slug: '/pediatric',
      image: '/images/pediatric-care.webp',
      description: 'Specialized chiropractic care for children, supporting their nervous system development and overall wellness.',
    },
    {
      id: 'prenatal',
      name: 'Prenatal Chiropractic Care',
      shortName: 'Prenatal',
      slug: '/prenatal',
      image: '/images/prenatal-care.webp',
      description: 'Gentle chiropractic care for expecting mothers to support a healthy pregnancy and optimal birth outcomes.',
    },
    {
      id: 'family',
      name: 'Family Chiropractic Care',
      shortName: 'Family',
      slug: '/family',
      image: '/images/family-care.webp',
      description: 'Comprehensive chiropractic care for the whole family, promoting optimal nervous system function.',
    },
  ],

  // ============================================
  // TESTIMONIALS
  // ============================================
  testimonials: [
    {
      id: 1,
      name: 'James Hawkins',
      text: 'Dr Zach is hands down the best chiropractors. His approach is so much different and has helped me a ton. Awesome Dr who really cares about you as a person!! Highly recommend!!',
      rating: 5,
      datePublished: '2024-08-15',
    },
    {
      id: 2,
      name: 'L B',
      text: 'Dr. Zach is an amazing chiropractor! He explains things really well, cares about his clients and every adjustment has helped to ease the tension in my son\'s nervous system! My sons says,"I\'m really happy to have Dr. Zach as my chiropractor!"',
      rating: 5,
      datePublished: '2024-09-22',
    },
    {
      id: 3,
      name: 'Destinee Viella',
      text: 'Dr. Zach has a very warm and welcoming atmosphere in his office, I felt very calm and well taken care of during our session. He takes his time to understand your concerns and does an amazing job with being able to pin point those issues. He also gave me some great advice and tips on how to help keep up with progress we\'ve made. I\'ve had 4 sessions so far with Dr. Zach and each time I get the results I was hoping for, which makes me excited to go back!',
      rating: 5,
      datePublished: '2024-10-05',
    },
  ],

  // ============================================
  // CUSTOM COPY OVERRIDES
  // Use these to override default template copy.
  // Set to null to use template defaults.
  // ============================================
  customCopy: {
    // Hero section tagline
    heroTagline: null,
    // About page doctor bio (uses doctor.bio if null)
    aboutBio: null,
    // Footer tagline
    footerTagline: null,
    // Any page-specific overrides
    pages: {
      home: {
        heroHeadline: null,
        heroSubheadline: null,
      },
      about: {
        headline: null,
      },
    },
  },

  // ============================================
  // OFFICE-SPECIFIC FEATURES
  // Enable/disable features based on what the office offers
  // ============================================
  features: {
    // Does this office have the Talsky Tonal technique page?
    talskyTonal: true,
    // Does this office have INSiGHT scanning equipment?
    insightScans: true,
    // Does this office offer workshops/events?
    eventsWorkshops: true,
    // Does this office have downloadable guides?
    freeGuides: true,
  },
} as const;

// ============================================
// COMPUTED VALUES (don't modify these)
// ============================================

// Aggregate rating computed from testimonials
export const aggregateRating = {
  ratingValue: SITE.testimonials.reduce((sum, t) => sum + t.rating, 0) / SITE.testimonials.length,
  reviewCount: SITE.testimonials.length,
  bestRating: 5,
  worstRating: 1,
};

// Get active social links (non-empty)
export const activeSocials = Object.entries(SITE.socials)
  .filter(([, url]) => url)
  .map(([platform, url]) => ({ platform, url }));

// Legacy exports for backwards compatibility with existing components
export const { janeUrl, janeUrlWithUtm } = {
  janeUrl: SITE.booking.url,
  janeUrlWithUtm: SITE.booking.urlWithUtm,
};
