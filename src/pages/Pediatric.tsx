import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '@drzach/website-toolkit';
import { Baby, Heart, Shield, Smile } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import { medicalWebPageSchema, faqSchema } from '../lib/schema';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import AuthorByline from '../components/AuthorByline';

const pediatricFaqs = [
  {
    question: 'Is chiropractic care safe for infants and newborns?',
    answer: 'Yes. Pediatric chiropractic uses extremely gentle, low-force techniques — about the same pressure you would use to test a ripe tomato. There is no cracking, popping, or forceful manipulation. Dr. Zach Conner uses Talsky Tonal Chiropractic, a non-manipulative approach specifically suited for babies and young children. The care is safe from birth and is regularly provided to newborns at Cultivate Wellness Chiropractic.',
  },
  {
    question: 'What conditions can pediatric chiropractic help with?',
    answer: 'Pediatric chiropractic at Cultivate Wellness addresses a wide range of childhood conditions including colic, reflux, and digestive issues in infants; sleep difficulties; ear infections; torticollis (head tilt); plagiocephaly (flat head); tongue and lip ties; sensory processing disorder; ADHD and focus challenges; autism spectrum and neurodevelopmental differences; developmental and speech delays; bedwetting; scoliosis; and general wellness and immune support.',
  },
  {
    question: 'How does chiropractic care help children with autism or sensory processing issues?',
    answer: 'Neurologically-focused chiropractic care works by reducing subluxation (neurospinal stress) that interferes with the nervous system\'s ability to properly receive and process sensory input. By restoring nervous system integrity through gentle tonal adjustments and INSiGHT scanning, we help children regulate their nervous systems more effectively. Many families report improvements in sleep, focus, emotional regulation, and sensory tolerance with consistent care.',
  },
  {
    question: 'At what age can a child start chiropractic care?',
    answer: 'Children can begin chiropractic care from birth. In fact, the birth process — even natural deliveries — can create neurospinal stress in newborns. Dr. Zach regularly cares for babies as young as a few days old. The techniques used are adapted to each child\'s age, size, and developmental stage. Care is appropriate from newborns through teens and into adulthood.',
  },
  {
    question: 'How many visits will my child need?',
    answer: 'Every child is different, so the frequency and number of visits depends on the specific concerns and how the child responds to care. Dr. Zach always starts with an INSiGHT neurological scan to get an objective baseline of how your child\'s nervous system is functioning. After the initial evaluation, he creates a personalized care plan. Some children see significant changes within a few visits; others benefit from longer wellness care. Progress is tracked objectively with re-scans.',
  },
];

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
      description: (
        <>
          Address common childhood issues like{' '}
          <Link to="/conditions/colic-infant-digestive" className="text-primary-dark underline hover:text-primary-accent">colic</Link>,{' '}
          <Link to="/conditions/acid-reflux-gerd" className="text-primary-dark underline hover:text-primary-accent">reflux</Link>, and{' '}
          <Link to="/conditions/sleep-disorders" className="text-primary-dark underline hover:text-primary-accent">sleep difficulties</Link>.
        </>
      ),
    },
  ];

  return (
    <>
      <Seo
        title="Pediatric Chiropractor Rochester Hills, MI"
        description="Specialized pediatric chiropractic in Rochester Hills for infants & children. Gentle care for colic, sleep issues, autism & developmental challenges. Book today!"
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
          dateModified: '2026-03-19',
          author: 'Dr. Zach Conner',
          url: '/pediatric',
          therapy: {
            name: 'Pediatric Chiropractic Care',
            description: 'Gentle, specialized chiropractic adjustments tailored for developing spines and nervous systems from birth through adolescence',
          },
          wordCount: 1200,
        })}
      />
      <JsonLd data={faqSchema(pediatricFaqs)} />

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
            What truly distinguishes Cultivate Wellness is our specialty and expertise in pediatric care. We can achieve remarkable outcomes across a range of conditions, from soothing fussy and{' '}
            <Link to="/conditions/colic-infant-digestive" className="underline hover:text-primary-light transition-colors">colicky babies</Link>
            {' '}to aiding chronically ill children, and supporting kids and teens facing{' '}
            <Link to="/conditions/sensory-processing-disorder" className="underline hover:text-primary-light transition-colors">sensory</Link>
            {' '}and{' '}
            <Link to="/conditions/autism-neurodevelopmental" className="underline hover:text-primary-light transition-colors">spectrum challenges</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Benefits for Your Child
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
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
            {([
              { label: 'Colic', slug: 'colic-infant-digestive' },
              { label: 'Reflux', slug: 'acid-reflux-gerd' },
              { label: 'Ear Infections', slug: 'ear-infections' },
              { label: 'Sleep Issues', slug: 'sleep-disorders' },
              { label: 'Torticollis', slug: 'torticollis' },
              { label: 'Growing Pains', slug: '' },
              { label: 'Scoliosis', slug: 'scoliosis' },
              { label: 'Sports Injuries', slug: 'sports-performance' },
              { label: 'Posture Problems', slug: 'posture-tech-neck' },
            ]).map((condition) =>
              condition.slug ? (
                <Link
                  key={condition.label}
                  to={`/conditions/${condition.slug}`}
                  className="bg-white p-4 rounded-lg text-center font-medium text-primary-dark hover:bg-primary-light/10 hover:shadow-md transition-all"
                >
                  {condition.label}
                </Link>
              ) : (
                <div key={condition.label} className="bg-white p-4 rounded-lg text-center font-medium text-gray-700">
                  {condition.label}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthorByline publishDate="2024-01-10" modifiedDate="2026-03-19" />
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
