import { SITE, aggregateRating } from '../data/site';
import { Link } from 'react-router-dom';
import ServicesGrid from '../components/ServicesGrid';
import TestimonialSlider from '../components/TestimonialSlider';
import CTABanner from '../components/CTABanner';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { aggregateRatingSchema, reviewSchema } from '../lib/schema';

export default function Home() {
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

      <section className="relative bg-gray-800">
        <img
          src="/images/hero-family.webp"
          alt="Cultivate Wellness Chiropractic"
          className="w-full h-auto"
        />
      </section>

      <section className="py-16 bg-white">
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
            className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-lg"
          >
            Workshops For Parents
          </Link>
        </div>
      </section>

      <section className="relative py-20 min-h-[400px] flex items-center justify-center" style={{ backgroundImage: 'url(/images/background-pattern.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#5a7a99' }}>
        <div className="absolute inset-0 z-0" style={{ backgroundColor: 'rgba(90, 122, 153, 0.85)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl sm:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
            Our team is skilled in <strong>Pediatric, Prenatal, and Family Chiropractic</strong>. Click the button to learn how we care for you and your family!
          </p>
          <Link
            to="/new-patient-center"
            className="inline-block bg-primary-dark text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-xl"
          >
            New Patient Center
          </Link>
        </div>
      </section>

      <ServicesGrid />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Guides for Parents</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Download our expert resources to help your child thrive naturally
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/rhkn-guide"
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/images/rhkn-guide.webp"
                  alt="Raising Healthy Kids Naturally"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                  Raising Healthy Kids Naturally
                </h3>
                <span className="text-primary-dark font-medium text-sm">Download Free →</span>
              </div>
            </Link>
            <Link
              to="/3-ways-to-sleep"
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/images/sleep-guide.webp"
                  alt="3 Ways to Improve Your Child's Sleep"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                  3 Ways to Improve Your Child's Sleep
                </h3>
                <span className="text-primary-dark font-medium text-sm">Download Free →</span>
              </div>
            </Link>
            <Link
              to="/3-ways-to-poop"
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/images/pooping-guide.webp"
                  alt="3 Ways to Get Your Child Pooping"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                  3 Ways to Get Your Child Pooping
                </h3>
                <span className="text-primary-dark font-medium text-sm">Download Free →</span>
              </div>
            </Link>
          </div>
          <div className="text-center">
            <Link
              to="/free-guides-for-parents"
              className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-lg"
            >
              View All Free Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-[4rem] overflow-hidden shadow-2xl">
              <img
                src="/images/dr-zach.webp"
                alt="Dr. Zach Conner"
                className="w-full h-full object-cover scale-110"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Cultivate Wellness is led by Dr. Zach Conner, <span className="font-semibold">an esteemed educator and practitioner of Talsky Tonal Chiropractic, a gentle, highly effective neuro-focused approach to care.</span> From your first visit, expect to be embraced as part of our Cultivate Wellness family as we journey together towards a healthier, happier life.
              </p>
              <Link
                to="/meet-dr-zach"
                className="inline-block bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-accent transition"
              >
                Meet Dr. Zach
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
            <div>
              <img
                src="/images/family-adjustment.webp"
                alt="Family with children by the lake"
                className="rounded-lg shadow-lg w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">Office Hours</h2>
          <div className="mb-8 px-4 py-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-center text-gray-800 leading-relaxed">
              <strong className="text-blue-900">New Patients:</strong> We have merged with Van Every Family Chiropractic Center and are no longer accepting new patients at this location. To schedule a new patient appointment with Dr. Zach, please call <a href="tel:+12486160900" className="text-primary-dark font-semibold hover:underline">(248) 616-0900</a>.<br />
              <span className="text-sm italic mt-2 block">Please mention that you were referred by Cultivate Wellness Chiropractic to see Dr. Zach.</span><br />
              <strong className="text-blue-900 mt-4 block">For Current Practice Members:</strong> These are our office hours for existing patients.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/office-hours.webp"
              alt="Office Hours Schedule"
              className="w-full max-w-2xl rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <CTABanner
        title="Ready to Start Your Wellness Journey?"
        description="Schedule your first appointment and discover how chiropractic care can transform your family's health."
        buttonText="Book Your Appointment"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
