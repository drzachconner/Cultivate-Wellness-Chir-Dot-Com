import { SITE } from '../data/site';
import { Link } from 'react-router-dom';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import CTABanner from '../components/CTABanner';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { Heart, Brain, ScanLine, Home as HomeIcon, Users, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <>
      <Seo
        title="About Us | Chiropractor Rochester Hills, MI"
        description="Meet the team at Cultivate Wellness Chiropractic in Rochester Hills, MI. Gentle, neuro-focused care for families and children with special needs."
        canonical="/about-us"
        ogImage="/images/family-adjustment.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'About Us', url: `https://${SITE.domain}/about-us` },
      ])} />

      {/* Hero with gradient overlay */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/family-adjustment.webp"
            alt="About Cultivate Wellness Chiropractic"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-white mb-8 max-w-3xl mx-auto">
            Gentle and specific "nerve-first" approach to pediatric, prenatal, and family care.
          </p>
          <Link
            to="/new-patient-center"
            className="inline-flex items-center gap-2 bg-white text-primary-dark px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            New Patient Center
          </Link>
        </div>
      </section>

      {/* Intro + Highlight Box */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Embracing Your Family as Ours</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Cultivate Wellness Chiropractic, we genuinely treat every patient as an extension of our own family. You're not just a name on a health record; you're part of our community. From the first warm smile at the reception desk to our careful, personalized approach, we're dedicated to making your experience with us as welcoming and comfortable as possible.
            </p>

            <div className="bg-primary-light/10 border border-primary-light/30 rounded-xl p-8 mt-8">
              <div className="bg-primary-light/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <Heart size={20} className="text-primary-dark" />
              </div>
              <p className="text-sm font-semibold text-primary-dark uppercase tracking-wide mb-2">
                Our Promise
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                Join our extended family and discover the Cultivate Wellness difference, where every visit feels like coming home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nerve First Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Nerve First: Our Unique Approach</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We take a "nerve first" approach through our specialized practice of Talsky Tonal Chiropractic, a unique, gentle yet powerful technique that respects the intelligence of the body.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Brain size={24} className="text-primary-dark" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Talsky Tonal Chiropractic</h3>
                <p className="text-gray-700">
                  Our team includes one of two certified teachers of Talsky Tonal, bringing advanced expertise in this neurologically-focused, non-manipulative technique.{' '}
                  <Link to="/talsky-tonal-chiropractic" className="text-primary-dark font-semibold hover:text-primary-accent underline">
                    Learn more →
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <ScanLine size={24} className="text-primary-dark" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">INSiGHT Scanning Technology</h3>
                <p className="text-gray-700">
                  We don't guess, we test! Our state-of-the-art{' '}
                  <Link to="/insight-scans" className="text-primary-dark font-semibold hover:text-primary-accent underline">
                    INSiGHT scanning technology
                  </Link>
                  {' '}accurately measures your nervous system function.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Sparkles size={24} className="text-primary-dark" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Specialized Care Plans</h3>
                <p className="text-gray-700">
                  Your unique case history is combined with nervous system scans to create custom care plans tailored for you, your child, and your family.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <HomeIcon size={24} className="text-primary-dark" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Designed for Families</h3>
                <p className="text-gray-700">
                  Specializing in pediatrics, prenatal, and family care. Whether you have a child with special needs, are expecting, or have a new baby, our space is welcoming for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-16 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/family-care.webp"
            loading="lazy"
            alt="Family chiropractic care"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/80 to-primary/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Our team is dedicated to optimizing the body's natural power to heal, function, and perform through gentle, neurologically-focused care, improving the well-being of children, their families, and the broader community.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Our Vision</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                We are cultivating a future where children, especially those with special needs, and their families find the strength, support, and transformative care they need to overcome challenges and reach their fullest potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Meet Our Team in Person"
        description="Schedule a consultation and experience the Cultivate Wellness difference."
        buttonText="Book Your Visit"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
