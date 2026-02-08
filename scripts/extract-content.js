/**
 * Content Extraction Script for Chiropractic Websites
 *
 * This script scrapes an existing chiropractic website to extract:
 * - Doctor name and credentials
 * - Office address, phone, email
 * - Social media links
 * - Testimonials
 * - Images
 *
 * Usage: node scripts/extract-content.js https://example-chiro.com
 *
 * Output: Creates a JSON file in scripts/extracted/ with the data
 */

import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, 'extracted');

// Common patterns for chiropractic websites
const patterns = {
  phone: /(?:\+1[- ]?)?(?:\(?[0-9]{3}\)?[- ]?)?[0-9]{3}[- ]?[0-9]{4}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  credentials: /\b(DC|D\.C\.|CACCP|FICPA|DICCP|RN|NP|PA)\b/gi,
  doctorName: /(?:Dr\.?\s+)?([A-Z][a-z]+\s+[A-Z][a-z]+)(?:,?\s*(DC|D\.C\.))?/g,
};

// Pages to scrape
const pagesToScrape = [
  '/',
  '/about',
  '/about-us',
  '/meet-the-doctor',
  '/our-team',
  '/contact',
  '/contact-us',
  '/testimonials',
  '/reviews',
  '/services',
];

async function extractContent(url) {
  console.log(`\n🔍 Extracting content from: ${url}\n`);

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const extracted = {
    sourceUrl: url,
    extractedAt: new Date().toISOString(),
    business: {
      name: null,
      phone: null,
      phoneDisplay: null,
      email: null,
      address: {
        street: null,
        city: null,
        region: null,
        postal: null,
        formatted: null,
      },
    },
    doctor: {
      fullName: null,
      credentials: [],
      bio: null,
    },
    socials: {
      facebook: null,
      instagram: null,
      tiktok: null,
      youtube: null,
      linkedin: null,
      twitter: null,
    },
    testimonials: [],
    images: {
      logo: null,
      doctorPhoto: null,
      otherImages: [],
    },
    hours: [],
    rawText: {},
  };

  // Helper to clean URL
  const cleanUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('//')) return 'https:' + u;
    if (u.startsWith('/')) return new URL(u, url).href;
    return u;
  };

  // Scrape each page
  for (const path of pagesToScrape) {
    const pageUrl = new URL(path, url).href;

    try {
      console.log(`📄 Scraping: ${path}`);
      const response = await page.goto(pageUrl, {
        waitUntil: 'networkidle0',
        timeout: 15000,
      });

      if (!response || response.status() >= 400) {
        console.log(`   ⚠️  Page not found or error: ${response?.status()}`);
        continue;
      }

      // Wait for content
      await new Promise((r) => setTimeout(r, 1000));

      // Extract text content
      const textContent = await page.evaluate(() => document.body.innerText);
      extracted.rawText[path] = textContent;

      // Extract business name from title or h1
      if (!extracted.business.name) {
        extracted.business.name = await page.evaluate(() => {
          const title = document.querySelector('title')?.textContent;
          const h1 = document.querySelector('h1')?.textContent;
          // Usually the business name is in the title before a separator
          const titleName = title?.split(/[|\-–—]/)[0]?.trim();
          return titleName || h1;
        });
      }

      // Extract phone numbers
      const phones = textContent.match(patterns.phone);
      if (phones && phones.length > 0 && !extracted.business.phone) {
        extracted.business.phoneDisplay = phones[0];
        extracted.business.phone = '+1-' + phones[0].replace(/\D/g, '').slice(-10);
      }

      // Extract emails
      const emails = textContent.match(patterns.email);
      if (emails && emails.length > 0 && !extracted.business.email) {
        // Filter out common non-office emails
        const officeEmail = emails.find(
          (e) => !e.includes('facebook') && !e.includes('google') && !e.includes('instagram')
        );
        extracted.business.email = officeEmail || emails[0];
      }

      // Extract social links
      const socialLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        return links.map((a) => a.href);
      });

      socialLinks.forEach((link) => {
        if (link.includes('facebook.com') && !extracted.socials.facebook) {
          extracted.socials.facebook = link;
        }
        if (link.includes('instagram.com') && !extracted.socials.instagram) {
          extracted.socials.instagram = link;
        }
        if (link.includes('tiktok.com') && !extracted.socials.tiktok) {
          extracted.socials.tiktok = link;
        }
        if (link.includes('youtube.com') && !extracted.socials.youtube) {
          extracted.socials.youtube = link;
        }
        if (link.includes('linkedin.com') && !extracted.socials.linkedin) {
          extracted.socials.linkedin = link;
        }
        if (link.includes('twitter.com') || link.includes('x.com')) {
          if (!extracted.socials.twitter) extracted.socials.twitter = link;
        }
      });

      // Extract doctor name and credentials
      if (!extracted.doctor.fullName) {
        const doctorMatch = await page.evaluate(() => {
          // Look for common patterns
          const headers = document.querySelectorAll('h1, h2, h3, h4');
          for (const h of headers) {
            const text = h.textContent || '';
            if (text.includes('Dr.') || text.includes('Meet')) {
              return text;
            }
          }
          return null;
        });

        if (doctorMatch) {
          // Clean up the name
          const nameMatch = doctorMatch.match(/Dr\.?\s*([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)/);
          if (nameMatch) {
            extracted.doctor.fullName = 'Dr. ' + nameMatch[1];
          }
        }
      }

      // Extract credentials from text
      const credentials = textContent.match(patterns.credentials);
      if (credentials) {
        extracted.doctor.credentials = [...new Set(credentials.map((c) => c.toUpperCase()))];
      }

      // Extract address (look for structured data first)
      const addressData = await page.evaluate(() => {
        // Check for schema.org structured data
        const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of ldJsonScripts) {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data.address || data['@type'] === 'LocalBusiness' || data['@type'] === 'Chiropractor') {
              const addr = data.address || data;
              return {
                street: addr.streetAddress,
                city: addr.addressLocality,
                region: addr.addressRegion,
                postal: addr.postalCode,
              };
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
        return null;
      });

      if (addressData && !extracted.business.address.street) {
        extracted.business.address = {
          ...extracted.business.address,
          ...addressData,
        };
      }

      // Extract testimonials (look for common patterns)
      if (path.includes('testimonial') || path.includes('review')) {
        const testimonials = await page.evaluate(() => {
          const results = [];
          // Look for blockquotes or testimonial-like elements
          const quotes = document.querySelectorAll('blockquote, .testimonial, .review, [class*="testimonial"], [class*="review"]');
          quotes.forEach((q) => {
            const text = q.querySelector('p, .text, .content')?.textContent || q.textContent;
            const author = q.querySelector('.author, .name, cite')?.textContent;
            if (text && text.length > 20) {
              results.push({
                text: text.trim().slice(0, 500),
                author: author?.trim() || 'Anonymous',
              });
            }
          });
          return results;
        });

        extracted.testimonials.push(...testimonials);
      }

      // Extract images
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter((img) => {
            const src = img.src || img.getAttribute('data-src');
            return src && !src.includes('data:') && !src.includes('placeholder');
          })
          .map((img) => ({
            src: img.src || img.getAttribute('data-src'),
            alt: img.alt,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
          }));
      });

      // Categorize images
      images.forEach((img) => {
        const altLower = (img.alt || '').toLowerCase();
        const srcLower = (img.src || '').toLowerCase();

        if (altLower.includes('logo') || srcLower.includes('logo')) {
          if (!extracted.images.logo) {
            extracted.images.logo = cleanUrl(img.src);
          }
        } else if (
          altLower.includes('doctor') ||
          altLower.includes('dr.') ||
          srcLower.includes('doctor') ||
          srcLower.includes('headshot')
        ) {
          if (!extracted.images.doctorPhoto) {
            extracted.images.doctorPhoto = cleanUrl(img.src);
          }
        } else if (img.width > 200 && img.height > 200) {
          extracted.images.otherImages.push(cleanUrl(img.src));
        }
      });

      console.log(`   ✅ Extracted from ${path}`);
    } catch (error) {
      console.log(`   ⚠️  Error on ${path}: ${error.message}`);
    }
  }

  await browser.close();

  // Generate formatted address
  if (extracted.business.address.street) {
    const addr = extracted.business.address;
    extracted.business.address.formatted = [
      addr.street,
      [addr.city, addr.region, addr.postal].filter(Boolean).join(' '),
    ]
      .filter(Boolean)
      .join(', ');
  }

  // Deduplicate testimonials
  extracted.testimonials = extracted.testimonials
    .filter((t, i, arr) => arr.findIndex((x) => x.text === t.text) === i)
    .slice(0, 10);

  // Deduplicate images
  extracted.images.otherImages = [...new Set(extracted.images.otherImages)].slice(0, 10);

  // Generate output filename from domain
  const domain = new URL(url).hostname.replace(/\./g, '-');
  const outputPath = join(outputDir, `${domain}-${Date.now()}.json`);

  writeFileSync(outputPath, JSON.stringify(extracted, null, 2), 'utf-8');

  console.log(`\n✅ Extraction complete!`);
  console.log(`📁 Output saved to: ${outputPath}\n`);

  // Print summary
  console.log('📊 Summary:');
  console.log(`   Business: ${extracted.business.name || 'Not found'}`);
  console.log(`   Phone: ${extracted.business.phoneDisplay || 'Not found'}`);
  console.log(`   Email: ${extracted.business.email || 'Not found'}`);
  console.log(`   Doctor: ${extracted.doctor.fullName || 'Not found'}`);
  console.log(`   Credentials: ${extracted.doctor.credentials.join(', ') || 'Not found'}`);
  console.log(`   Testimonials: ${extracted.testimonials.length} found`);
  console.log(
    `   Social links: ${Object.values(extracted.socials).filter(Boolean).length} found`
  );
  console.log(`   Images: ${extracted.images.otherImages.length + 2} found`);

  return extracted;
}

// Main execution
const targetUrl = process.argv[2];

if (!targetUrl) {
  console.log(`
Usage: node scripts/extract-content.js <url>

Example:
  node scripts/extract-content.js https://example-chiro.com

This will:
1. Scrape the website for office information
2. Extract doctor name, credentials, contact info
3. Find social media links
4. Collect testimonials
5. List downloadable images
6. Save everything to scripts/extracted/<domain>.json
`);
  process.exit(1);
}

// Validate URL
try {
  new URL(targetUrl);
} catch {
  console.error('❌ Invalid URL. Please provide a full URL including https://');
  process.exit(1);
}

extractContent(targetUrl).catch((error) => {
  console.error('❌ Extraction failed:', error.message);
  process.exit(1);
});
