import { SITE, aggregateRating as siteAggregateRating, activeSocials } from '../data/site';
import { stripInlineLinks } from './render-inline-links';

/**
 * Schema.org structured data generators
 * All values are derived from the SITE config - no hardcoded office-specific data
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `https://${SITE.domain}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: `https://${SITE.domain}`,
    logo: `https://${SITE.domain}${SITE.images.logo}`,
    image: `https://${SITE.domain}${SITE.images.heroFamily}`,
    description: SITE.description,
    priceRange: SITE.priceRange,
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: SITE.foundingYear,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: SITE.geo.latitude,
        longitude: SITE.geo.longitude,
      },
      geoRadius: '30000',
    },
    openingHoursSpecification: SITE.hours.structured.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    sameAs: [
      ...activeSocials.map((s) => s.url),
      `https://www.google.com/maps/place/?q=place_id:${SITE.googlePlaceId}`,
    ],
    hasMap: `https://www.google.com/maps/place/${encodeURIComponent(SITE.name)}/@${SITE.geo.latitude},${SITE.geo.longitude}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Chiropractic Services',
      itemListElement: SITE.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: service.name,
          description: service.description,
        },
      })),
    },
  };
}

export function personSchema() {
  const doctor = SITE.doctor;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://${SITE.domain}/#${doctor.schemaId}`,
    name: doctor.fullName,
    givenName: doctor.firstName,
    familyName: doctor.lastName,
    honorificPrefix: doctor.honorificPrefix,
    honorificSuffix: doctor.honorificSuffix,
    jobTitle: doctor.title,
    description: doctor.bio,
    image: `https://${SITE.domain}${doctor.image}`,
    url: `https://${SITE.domain}${doctor.pageSlug}`,
    worksFor: {
      '@id': `https://${SITE.domain}/#organization`,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: doctor.education,
      sameAs: doctor.educationWikidata,
    },
    hasCredential: doctor.certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: cert.type,
      name: cert.name,
    })),
    knowsAbout: doctor.expertise.map((expertise) => {
      // Check if this expertise has a matching service page
      const matchingService = SITE.services.find((s) =>
        expertise.toLowerCase().includes(s.shortName.toLowerCase())
      );
      if (matchingService) {
        return {
          '@type': 'Thing',
          name: expertise,
          url: `https://${SITE.domain}${matchingService.slug}`,
        };
      }
      return expertise;
    }),
    sameAs: activeSocials
      .filter((s) => ['facebook', 'youtube', 'linkedin'].includes(s.platform))
      .map((s) => s.url),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Chiropractor',
    '@id': `https://${SITE.domain}/#localbusiness`,
    name: SITE.name,
    url: `https://${SITE.domain}`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    priceRange: SITE.priceRange,
    image: `https://${SITE.domain}${SITE.images.heroFamily}`,
    openingHours: SITE.hours.shortFormat,
    areaServed: {
      '@type': 'City',
      name: SITE.address.city,
    },
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripInlineLinks(faq.answer),
      },
    })),
  };
}

export function articleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  url: string;
  reviewedBy?: {
    name: string;
    credentials: string;
  };
  wordCount?: number;
}) {
  const doctor = SITE.doctor;
  const authorName = article.author || doctor.fullName;

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.headline,
    description: article.description,
    image: `https://${SITE.domain}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    lastReviewed: article.dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      '@id': `https://${SITE.domain}/#${doctor.schemaId}`,
      jobTitle: doctor.title,
      hasCredential: doctor.honorificSuffix,
    },
    ...(article.reviewedBy && {
      reviewedBy: {
        '@type': 'Person',
        name: article.reviewedBy.name,
        jobTitle: article.reviewedBy.credentials,
      },
    }),
    publisher: {
      '@id': `https://${SITE.domain}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${SITE.domain}${article.url}`,
    },
    ...(article.wordCount && { wordCount: article.wordCount }),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    description: service.description,
    image: `https://${SITE.domain}${service.image}`,
    url: `https://${SITE.domain}${service.url}`,
    provider: {
      '@id': `https://${SITE.domain}/#organization`,
    },
  };
}

export function howToSchema(howTo: {
  name: string;
  description: string;
  image: string;
  totalTime: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    image: `https://${SITE.domain}${howTo.image}`,
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function aggregateRatingSchema(rating?: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  // Use provided rating or fall back to computed site rating
  const ratingData = rating || siteAggregateRating;

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: ratingData.ratingValue,
    reviewCount: ratingData.reviewCount,
    bestRating: ratingData.bestRating || 5,
    worstRating: ratingData.worstRating || 1,
    itemReviewed: {
      '@id': `https://${SITE.domain}/#organization`,
    },
  };
}

export function reviewSchema(review: {
  author: string;
  datePublished: string;
  reviewBody: string;
  ratingValue: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@id': `https://${SITE.domain}/#organization`,
    },
  };
}

export function medicalWebPageSchema(page: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  url: string;
  condition?: {
    name: string;
    description?: string;
    wikipediaUrl?: string;
    wikidataId?: string;
  };
  therapy?: {
    name: string;
    description: string;
  };
  reviewedBy?: {
    name: string;
    credentials: string;
  };
  wordCount?: number;
}) {
  const doctor = SITE.doctor;
  const authorName = page.author || doctor.fullName;

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: page.headline,
    description: page.description,
    image: `https://${SITE.domain}${page.image}`,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    lastReviewed: page.dateModified,
    ...(page.condition && {
      about: {
        '@type': 'MedicalCondition',
        name: page.condition.name,
        ...(page.condition.description && { description: page.condition.description }),
        ...(page.condition.wikipediaUrl && { url: page.condition.wikipediaUrl }),
        ...(page.condition.wikidataId && {
          sameAs: `https://www.wikidata.org/wiki/${page.condition.wikidataId}`,
        }),
      },
    }),
    ...(page.therapy && {
      mentions: [
        {
          '@type': 'MedicalTherapy',
          name: page.therapy.name,
          description: page.therapy.description,
          sameAs: 'https://en.wikipedia.org/wiki/Chiropractic',
        },
      ],
    }),
    author: {
      '@type': 'Person',
      name: authorName,
      '@id': `https://${SITE.domain}/#${doctor.schemaId}`,
      jobTitle: doctor.title,
      hasCredential: doctor.honorificSuffix,
    },
    ...(page.reviewedBy && {
      reviewedBy: {
        '@type': 'Person',
        name: page.reviewedBy.name,
        jobTitle: page.reviewedBy.credentials,
      },
    }),
    publisher: {
      '@id': `https://${SITE.domain}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${SITE.domain}${page.url}`,
    },
    ...(page.wordCount && { wordCount: page.wordCount }),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}

export function injectSchema(schema: object) {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }
  return () => {};
}
