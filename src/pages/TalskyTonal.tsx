import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { medicalWebPageSchema } from '../lib/schema';
import { Brain, Heart, Users, Sparkles, Activity, Target } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function TalskyTonal() {
  const principles = [
    {
      icon: Brain,
      title: 'Neurologically Focused',
      description: 'Engages the nervous system directly to promote never-ending neurological optimization and restore the integrity and function of your entire nervous system.',
    },
    {
      icon: Heart,
      title: 'Safe, Gentle & Effective',
      description: 'A gentle approach that respects the intelligence of your body. No traditional bone cracking, just very specific adjustments that work with your body\'s natural healing ability.',
    },
    {
      icon: Users,
      title: 'Patient-Centered Care',
      description: 'Allows patients to be active participants in their own health journey. We don\'t guess, we test with state-of-the-art INSiGHT scanning technology.',
    },
    {
      icon: Sparkles,
      title: 'Vitalistic Analysis',
      description: 'Uses a vitalistic, moment-to-moment analysis of the entire spinal system — from tailbone through cranial bones — to identify exactly where the body is holding unnecessary tension.',
    },
    {
      icon: Activity,
      title: 'Pro-Active Healing',
      description: 'Emphasizes proactive healing and wellness rather than reactive symptom management. Supports continuous neurological improvement and overall function.',
    },
    {
      icon: Target,
      title: 'Less is More',
      description: 'Utilizes a "less is more" philosophy, providing precise, effective adjustments that facilitate your body\'s natural healing process without over-treating.',
    },
  ];

  return (
    <>
      <Seo
        title="Talsky Tonal Chiropractic | Rochester Hills, MI"
        description="Talsky Tonal Chiropractic in Rochester Hills - gentle, neurologically-focused care. Dr. Zach Conner is a certified teacher of this advanced technique. Book today!"
        canonical="/talsky-tonal-chiropractic"
        ogImage="/images/Talsky at source2.jpg"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Talsky Tonal Chiropractic', url: `https://${SITE.domain}/talsky-tonal-chiropractic` },
      ])} />
      <JsonLd
        data={medicalWebPageSchema({
          headline: 'Talsky Tonal Chiropractic - Neurologically-Focused Care',
          description: 'Advanced Talsky Tonal Chiropractic technique for gentle, neurologically-focused care. Release accumulated stress patterns, restore nervous system integrity, and promote never-ending optimization.',
          image: '/images/Talsky at source2.jpg',
          datePublished: '2024-01-10',
          dateModified: '2025-10-20',
          author: 'Dr. Zach Conner',
          url: '/talsky-tonal-chiropractic',
          therapy: {
            name: 'Talsky Tonal Chiropractic',
            description: 'Advanced neurologically-focused chiropractic technique using a vitalistic, moment-to-moment analysis to release stress patterns and restore optimal nervous system function',
          },
          wordCount: 1500,
        })}
      />
      <section className="relative py-32 bg-gray-900 min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Talsky at source2.jpg"
            alt="Talsky Tonal Chiropractic"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/50 to-primary/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Talsky Tonal Chiropractic
          </h1>
          <p className="text-xl sm:text-2xl text-white max-w-4xl mx-auto leading-relaxed">
            A paradigm shift into tonal chiropractic awareness. Gentle, neurologically-focused care
            that restores nervous system function and promotes proactive healing.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Talsky Tonal Chiropractic?</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              <a href="https://talskytonal.com" target="_blank" rel="noopener noreferrer" className="text-primary-dark font-semibold hover:text-primary-accent underline">Talsky Tonal Chiropractic</a> is an advanced chiropractic approach developed by Dr. Marvin
              Talsky in 2001. Dr. Talsky, who has been practicing since 1965 and graduated from Palmer
              College of Chiropractic in 1963, co-founded the renowned Torque Release Technique in 1995
              before developing this unique tonal method.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              This technique represents a paradigm shift in chiropractic care. Rather than simply addressing
              symptoms, Talsky Tonal Chiropractic focuses on finding and releasing accumulated stress patterns
              in the body, restoring the integrity and function of your nervous system so your body can heal
              and perform at its optimal level.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary-light/10/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Core Principles of Talsky Tonal Chiropractic
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-primary-light/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <principle.icon size={28} className="text-primary-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{principle.title}</h3>
                <p className="text-gray-700 leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding "Stress Stuck On"</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              When your body becomes overwhelmed with stress, it increases tension proportionate to that
              stress and holds that tension pattern until it receives information letting it know that it's
              safe to release. We refer to this as "stress stuck on" or in chiropractic terms, "subluxation."
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              These tension patterns accumulate in layers upon layers, filling what we call the "stress bucket."
              Your body can only hold so much stress before symptoms start to occur and the brain's ability to
              properly communicate with the rest of the body becomes interfered with by these layers of
              unnecessary held tension.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-8">How Talsky Tonal Chiropractic Works</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Talsky Tonal Chiropractic emphasizes spinal cord tension over spinal cord pressure, using a
              vitalistic, moment-to-moment analysis of the entire spinal system — from tailbone through cranial
              bones — to identify exactly where your body is holding onto tension that it no longer needs.
              Instead of forceful manipulations, adjustments use a gentle pressure input with a finger contact,
              taking only a few seconds. The corrections don't stop when you get off the table —
              they continue working with your body's movements and breathing.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              TTC finds this "stress stuck on" and gives your body the space, permission, and information it
              needs to release these layers of tension held in the body. Your body then learns how to better
              and better adjust itself. This technique is empowering to the body rather than forcing it,
              leading to the potential of never-ending optimization with continued wellness care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Talsky Tonal Chiropractic</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Addresses Root Causes</h3>
                <p className="text-white/90">
                  Goes beyond symptom relief to restore nervous system function and optimal performance by
                  enhancing the body's own innate ability to heal.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Gentle & Safe</h3>
                <p className="text-white/90">
                  Particularly effective for children with special needs, sensory processing differences,
                  and developmental challenges, as well as patients of all ages.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Enhanced Performance</h3>
                <p className="text-white/90">
                  Supports optimal function across all body systems, promoting healing, performance,
                  and overall quality of life.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Continuous Improvement</h3>
                <p className="text-white/90">
                  Facilitates never-ending neurological optimization, helping your body adapt and thrive
                  throughout life's changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Expert Talsky Tonal Care at Cultivate Wellness
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Dr. Zach is one of two certified teachers of Talsky Tonal Chiropractic,
              bringing the highest level of expertise in this specialized technique to our community.
              With a special interest in caring for children with sensory and developmental differences,
              Dr. Zach has witnessed the profound transformative effects this gentle approach can have
              on patients of all ages and backgrounds.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Cultivate Wellness Chiropractic, we combine Talsky Tonal Chiropractic with
              state-of-the-art{' '}
              <a href="/insight-scans" className="text-primary-dark font-semibold hover:text-primary-accent underline">
                INSiGHT scanning technology
              </a>
              {' '}to measure your nervous system function accurately. We don't guess, we test! This allows us to create custom care plans tailored
              to your unique needs and track your progress objectively.
            </p>
            <div className="bg-primary-dark text-white p-8 rounded-xl mt-8">
              <h3 className="text-2xl font-bold mb-4">Experience the Difference</h3>
              <p className="text-lg mb-6">
                Discover how Talsky Tonal Chiropractic can help you and your family achieve optimal
                nervous system function and unlock your body's natural healing potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Experience Talsky Tonal Chiropractic?"
        description="Schedule a consultation to learn how this gentle, neurologically-focused approach can help you and your family."
        buttonText="Schedule Consultation"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
