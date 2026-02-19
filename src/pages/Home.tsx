import { useEffect, useRef, useState } from 'react';
import { SITE, aggregateRating } from '../data/site';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getGroupedConditions } from '../data/conditions';
import ServicesGrid from '../components/ServicesGrid';
import TestimonialSlider from '../components/TestimonialSlider';
import CTABanner from '../components/CTABanner';
import OfficeHours from '../components/OfficeHours';
import WhatToExpect from '../components/WhatToExpect';
import AnimateOnScroll from '../components/AnimateOnScroll';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { aggregateRatingSchema, reviewSchema } from '../lib/schema';

function SectionGradient({ from = 'white', to = 'gray-50' }: { from?: string; to?: string }) {
  return (
    <div
      className="h-16 w-full"
      style={{
        background: `linear-gradient(to bottom, var(--tw-gradient-from, ${from === 'white' ? '#ffffff' : from === 'gray-50' ? '#f9fafb' : from}), var(--tw-gradient-to, ${to === 'white' ? '#ffffff' : to === 'gray-50' ? '#f9fafb' : to}))`,
      }}
    />
  );
}

function ConditionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const groups = getGroupedConditions();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm"
      >
        Conditions
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <Link
            to="/conditions"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gray-50 border-b border-gray-100"
          >
            View All Conditions
          </Link>
          {groups.map((group) => (
            <div key={group.category}>
              <p className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                {group.label}
              </p>
              {group.conditions.map((c) => (
                <Link
                  key={c.slug}
                  to={`/conditions/${c.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary-dark transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          ))}
          <Link
            to="/conditions"
            onClick={() => setIsOpen(false)}
            className="sticky bottom-0 block px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gray-50 border-t border-gray-100 bg-white"
          >
            View All Conditions
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // Parallax for Dr. Zach portrait
  const bioSectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (!bioSectionRef.current || !portraitRef.current) return;
      const rect = bioSectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      // Only apply when section is in view
      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        const offset = (progress - 0.5) * 40;
        portraitRef.current.style.transform = `translateY(${offset}px)`;
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Seo
        title="Pediatric & Prenatal Chiropractor Rochester Hills, MI"
        description="Expert pediatric & prenatal chiropractor in Rochester Hills, MI. Dr. Zach Conner specializes in gentle, neurologically-focused care for families. Book today!"
        canonical="/"
        ogImage="/images/hero-family.webp"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Chiropractor",
          "name": SITE.name,
          "description": SITE.description,
          "image": `https://${SITE.domain}/logo.svg`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE.address.street,
            "addressLocality": SITE.address.city,
            "addressRegion": SITE.address.region,
            "postalCode": SITE.address.postal,
            "addressCountry": SITE.address.country,
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": SITE.geo.latitude,
            "longitude": SITE.geo.longitude,
          },
          "telephone": SITE.phone,
          "url": `https://${SITE.domain}`,
          "openingHours": SITE.hours.shortFormat,
          "hasMap": `https://maps.google.com/?q=${encodeURIComponent(SITE.address.street + ', ' + SITE.address.city + ', ' + SITE.address.region)}`,
          "priceRange": SITE.priceRange,
          "sameAs": Object.values(SITE.socials),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": aggregateRating.ratingValue,
            "reviewCount": aggregateRating.reviewCount,
            "bestRating": 5,
            "worstRating": 1,
          },
        }}
      />
      <JsonLd data={aggregateRatingSchema(aggregateRating)} />
      {SITE.testimonials.map((t) => (
        <JsonLd
          key={t.id}
          data={reviewSchema({
            author: t.name,
            datePublished: t.datePublished,
            reviewBody: t.text,
            ratingValue: t.rating,
          })}
        />
      ))}

      {/* Hero Section */}
      <section className="relative bg-gray-800">
        <img
          src="/images/hero-family.webp"
          alt="Cultivate Wellness Chiropractic"
          className="w-full h-auto"
        />
        {/* Conditions dropdown overlay */}
        <div className="absolute top-4 left-4 z-10">
          <ConditionsDropdown />
        </div>
      </section>

      {/* Intro Quote */}
      <section className="py-16 bg-white">
        <AnimateOnScroll>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Pediatric & Prenatal Chiropractor in Rochester Hills, MI
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
              "Our primary focus is your family's health and happiness. We specialize in <span className="text-primary-600 font-semibold">gentle, neuro-focused chiropractic care</span>. Whether the journey involves autism, epilepsy, special needs, or well baby checks and family wellness, our team is more than prepared to cultivate the best healing experience possible."
            </p>
            <p className="text-base text-gray-600 mb-8">
              - Dr. Zach Conner<br />
              <span className="text-primary-600">Rochester Hills, MI Chiropractor</span>
            </p>
            <Link
              to="/events-workshops"
              className="inline-block border-2 border-primary-dark text-primary-dark px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-dark hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Workshops For Parents
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Gradient: white → blue CTA */}

      {/* Blue CTA Band */}
      <AnimateOnScroll>
        <section className="relative py-20 min-h-[400px] flex items-center justify-center" style={{ backgroundImage: 'url(/images/background-pattern.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#5a7a99' }}>
          <div className="absolute inset-0 z-0" style={{ backgroundColor: 'rgba(90, 122, 153, 0.85)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
              Our team is skilled in <strong>Pediatric, Prenatal, and Family Chiropractic</strong>. Click the button to learn how we care for you and your family!
            </p>
            <Link
              to="/new-patient-center"
              className="inline-block bg-primary-dark text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              New Patient Center
            </Link>
          </div>
        </section>
      </AnimateOnScroll>

      {/* What to Expect */}
      <WhatToExpect />

      {/* Gradient: gray-50 → white */}
      <SectionGradient from="gray-50" to="white" />

      {/* Services */}
      <ServicesGrid />

      {/* Free Guides */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Guides for Parents</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Download our expert resources to help your child thrive naturally
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { to: '/rhkn-guide', img: '/images/rhkn-guide.webp', alt: 'Raising Healthy Kids Naturally', title: 'Raising Healthy Kids Naturally' },
              { to: '/3-ways-to-sleep', img: '/images/sleep-guide.webp', alt: '3 Ways to Improve Your Child\'s Sleep', title: '3 Ways to Improve Your Child\'s Sleep' },
              { to: '/3-ways-to-poop', img: '/images/pooping-guide.webp', alt: '3 Ways to Get Your Child Pooping', title: '3 Ways to Get Your Child Pooping' },
            ].map((guide, index) => (
              <AnimateOnScroll key={guide.to} delay={index * 150}>
                <Link
                  to={guide.to}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full block"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={guide.img}
                      alt={guide.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-primary-dark font-medium text-sm">Download Free →</span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="text-center">
              <Link
                to="/free-guides-for-parents"
                className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                View All Free Guides
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Gradient: gray-50 → white */}
      <SectionGradient from="gray-50" to="white" />

      {/* Dr. Zach Bio with Parallax */}
      <section ref={bioSectionRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll direction="left">
              <div ref={portraitRef} className="rounded-[4rem] overflow-hidden shadow-2xl will-change-transform">
                <img
                  src="/images/dr-zach.webp"
                  alt="Dr. Zach Conner"
                  className="w-full h-full object-cover scale-110"
                  loading="lazy"
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll direction="right">
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Cultivate Wellness is led by Dr. Zach Conner, <span className="font-semibold">an esteemed educator and practitioner of <Link to="/talsky-tonal-chiropractic" className="underline hover:text-primary-accent">Talsky Tonal Chiropractic</Link>, a gentle, highly effective neuro-focused approach to care.</span> From your first visit, expect to be embraced as part of our Cultivate Wellness family as we journey together towards a healthier, happier life.
                </p>
                <Link
                  to="/meet-dr-zach"
                  className="inline-block border-2 border-primary-dark text-primary-dark px-6 py-3 rounded-lg font-medium hover:bg-primary-dark hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Meet Dr. Zach
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll direction="left">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-4">MISSION:</h2>
                <p className="text-lg mb-8">
                  Our team is dedicated to optimizing the body's natural power to heal, function, and perform through gentle, neurologically-focused care, improving the well-being of children, their families, and the broader community.
                </p>
                <h2 className="text-3xl font-heading font-bold mb-4">VISION:</h2>
                <p className="text-lg">
                  We are cultivating a future where children, especially those with special needs, and their families find the strength, support, and transformative care they need to overcome challenges and reach their fullest potential.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll direction="right">
              <div>
                <img
                  src="/images/family-adjustment.webp"
                  alt="Family with children by the lake"
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <OfficeHours />

      {/* Gradient: white → gray-50 */}
      <SectionGradient from="white" to="gray-50" />

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Bottom CTA */}
      <CTABanner
        title="Ready to Start Your Wellness Journey?"
        description="Schedule your first appointment and discover how chiropractic care can transform your family's health."
        buttonText="Book Your Appointment"
        buttonLink="/schedule-appointment"
        showSocialProof
      />
    </>
  );
}
