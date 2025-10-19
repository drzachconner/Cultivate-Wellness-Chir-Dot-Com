import { useSeo } from '../hooks/useSeo';
import { SITE } from '../data/site';
import { team } from '../data/team';
import { useEffect } from 'react';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import CTABanner from '../components/CTABanner';

export default function AboutUs() {
  useSeo({
    title: 'About Us',
    description: 'Meet our team of dedicated chiropractors committed to your family\'s wellness.',
    canonical: '/about-us',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: 'About Us', url: `https://${SITE.domain}/about-us` },
    ]));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/family-adjustment.webp"
            alt="About Us"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Gentle and specific "nerve-first" approach to pediatric, prenatal, and family care.
          </p>
          <a
            href="/new-patient-center"
            className="inline-block bg-primary-dark text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-xl"
          >
            New Patient Center
          </a>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Embracing Your Family as Ours</h2>
            <p className="text-lg text-gray-700 mb-6">
              At Cultivate Wellness Chiropractic, we genuinely treat every patient as an extension of our own family. You're not just a name on a health record; you're part of our community. From the first warm smile at the reception desk to our careful, personalized approach, we're dedicated to making your experience with us as welcoming and comfortable as possible.
            </p>

            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6 mt-12">Nerve First: Our Unique Approach to Your Family's Health</h2>
            <p className="text-lg text-gray-700 mb-6">
              We take a "nerve first" approach through our specialized practice of Talsky Tonal Chiropractic. This unique and gentle yet powerful technique respects the intelligence of the body. It's particularly effective for children with special needs and has profound effects on people of all ages and backgrounds.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Dr. Zach is one of only two certified U.S. instructors of Talsky Tonal, bringing advanced expertise in this neurologically-focused approach. This gentle technique integrates chiropractic principles with quantum physics and consciousness to restore nervous system function and promote proactive healing.{' '}
              <a href="/talsky-tonal-chiropractic" className="text-primary-dark font-semibold hover:text-primary-accent underline">
                Learn more about Talsky Tonal Chiropractic →
              </a>
            </p>
            <p className="text-lg text-gray-700 mb-6">
              At Cultivate Wellness, we don't guess, we test! Our state-of-the-art and non-invasive INSiGHT scanning technology allows us to measure the function and performance of your nervous system accurately, ensuring we understand precisely what's happening in your body and how best to assist you.
            </p>

            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6 mt-12">Specialized Care</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our team is committed to offering tailered care plans. The unique case history is combined with the nervous system scans to create the custom care plans that are needed for you, your child, and your family.
            </p>

            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6 mt-12">Our Office, Designed for Families, by Families</h2>
            <p className="text-lg text-gray-700 mb-6">
              Specializing in pediatrics, prenatal, and family care, our office caters to every family's needs. Whether you have a child with special needs, are expecting, or already have a new baby, we've made our space welcoming and comforting for all.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Join our extended family and discover the Cultivate Wellness difference.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-8">MISSION:</h2>
              <p className="text-xl mb-12">
                Our team is dedicated to optimizing the body's natural power to heal, function, and perform through gentle, neurologically-focused care, improving the well-being of children, their families, and the broader community.
              </p>

              <h2 className="text-3xl font-heading font-bold mb-8">VISION:</h2>
              <p className="text-xl">
                We are cultivating a future where children, especially those with special needs, and their families find the strength, support, and transformative care they need to overcome challenges and reach their fullest potential.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&h=600&fit=crop"
                alt="Family with children by the lake"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Meet Our Team in Person"
        description="Schedule a consultation and experience the Cultivate Wellness difference."
        buttonText="Book Your Visit"
        buttonLink={SITE.janeUrlWithUtm}
      />
    </>
  );
}
