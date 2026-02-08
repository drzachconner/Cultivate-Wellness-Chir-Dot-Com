import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { Baby, Heart, Shield, Smile } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import { medicalWebPageSchema } from '../lib/schema';
import AboutThisPage from '../components/AboutThisPage';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function Pediatric() {
  const benefits = [
    {
      icon: Baby,
      title: 'Gentle Techniques',
      description: 'Specially adapted adjustments that are safe and comfortable for little ones.',
    },
    {
      icon: Heart,
      title: 'Support Development',
      description: 'Promote proper growth, posture, and nervous system function from birth.',
    },
    {
      icon: Shield,
      title: 'Boost Immunity',
      description: 'Help strengthen your child\'s natural defenses and overall wellness.',
    },
    {
      icon: Smile,
      title: 'Improve Sleep & Comfort',
      description: 'Address common childhood issues like colic, reflux, and sleep difficulties.',
    },
  ];

  return (
    <>
      <Seo
        title="Pediatric Chiropractic"
        description="Specialized pediatric chiropractic care for infants and children to support healthy development."
        canonical="/pediatric"
        ogImage="/images/pediatric-care.webp"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: 'Pediatric', url: `https://${SITE.domain}/pediatric` },
        ])}
      />
      <JsonLd
        data={medicalWebPageSchema({
          headline: 'Pediatric Chiropractic Care for Children & Infants',
          description: 'Specialized chiropractic care for infants and children, supporting healthy nervous system development, addressing colic, sleep issues, developmental challenges, and promoting overall wellness from birth through adolescence.',
          image: '/images/pediatric-care.webp',
          datePublished: '2024-01-10',
          dateModified: '2025-10-20',
          author: 'Dr. Zach Talsky',
          url: '/pediatric',
          therapy: {
            name: 'Pediatric Chiropractic Care',
            description: 'Gentle, specialized chiropractic adjustments tailored for developing spines and nervous systems from birth through adolescence',
          },
          wordCount: 1200,
        })}
      />

      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="/images/pediatric-care.webp"
            alt="Pediatric Chiropractic Care"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Pediatric
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            What truly distinguishes Cultivate Wellness is our specialty and expertise in pediatric care. We can achieve remarkable outcomes across a range of conditions, from soothing fussy and colicky babies to aiding chronically ill children, and supporting kids and teens facing sensory and spectrum challenges.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutThisPage
            topic="Pediatric Chiropractic Care"
            topicUrl="https://en.wikipedia.org/wiki/Chiropractic"
            wikidataId="Q184711"
            datePublished="2024-01-10"
            dateModified="2025-10-20"
            sources={[
              {
                name: 'International Chiropractic Pediatric Association',
                url: 'https://www.icpa4kids.com/',
              },
              {
                name: 'CDC Child Development',
                url: 'https://www.cdc.gov/child-development/',
              },
            ]}
            keyFacts={[
              'Safe for infants from birth with specialized gentle techniques',
              'Supports healthy nervous system development',
              'May help with colic, sleep issues, and developmental challenges',
              '80% of parents report improvement in first 4-8 weeks',
            ]}
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Benefits for Your Child
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <benefit.icon size={24} className="text-primary-dark" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Conditions We Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['Colic', 'Reflux', 'Ear Infections', 'Sleep Issues', 'Torticollis', 'Growing Pains',
              'Scoliosis', 'Sports Injuries', 'Posture Problems'].map((condition) => (
              <div key={condition} className="bg-white p-4 rounded-lg text-center font-medium text-gray-700">
                {condition}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Give Your Child the Gift of Wellness"
        description="Schedule a gentle, caring consultation for your little one today."
        buttonText="Book Pediatric Appointment"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
