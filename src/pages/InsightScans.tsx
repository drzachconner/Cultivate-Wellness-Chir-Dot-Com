import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { medicalWebPageSchema } from '../lib/schema';
import { Activity, Heart, Brain, TrendingUp } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function InsightScans() {
  const scanTypes = [
    {
      icon: Activity,
      title: 'NeuroThermal Scan',
      description: 'Provides insights into subluxation and dysautonomia, helping us understand digestive, immune, and hormonal conditions at their neurological root.',
    },
    {
      icon: Heart,
      title: 'HRV (Heart Rate Variability) Scan',
      description: 'Indicates your body\'s adaptability to stress and measures how well your nervous system responds to daily challenges.',
    },
    {
      icon: Brain,
      title: 'EMG Scan',
      description: 'Detects neuromotor challenges, particularly useful for conditions like Autism, ADHD, and Anxiety by identifying nervous system imbalances.',
    },
  ];

  return (
    <>
      <Seo
        title="INSiGHT Scans - Advanced Nervous System Assessment"
        description="We don't guess, we test. Using INSiGHT Scans, we craft tailored care plans for your child's unique neurological needs through advanced scanning technology."
        canonical="/insight-scans"
        ogImage="/images/insight-hero.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'INSiGHT Scans', url: `https://${SITE.domain}/insight-scans` },
      ])} />
      <JsonLd
        data={medicalWebPageSchema({
          headline: 'INSiGHT Scans - Advanced Nervous System Assessment',
          description: 'State-of-the-art INSiGHT scanning technology for objective nervous system assessment. NeuroThermal, HRV, and EMG scans provide the CORE Score to guide personalized chiropractic care plans.',
          image: '/images/insight-hero.webp',
          datePublished: '2024-01-10',
          dateModified: '2025-10-20',
          author: 'Dr. Zach Talsky',
          url: '/insight-scans',
          therapy: {
            name: 'INSiGHT Nervous System Scanning',
            description: 'Non-invasive NeuroThermal, HRV, and EMG scanning technology to measure nervous system function and create personalized care plans',
          },
          wordCount: 1000,
        })}
      />
      <section className="relative py-32 bg-gray-900 min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/insight-hero.webp"
            alt="INSiGHT Scanning Technology"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/80 to-primary/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            INSiGHT Scans
          </h1>
          <p className="text-xl sm:text-2xl text-white max-w-4xl mx-auto leading-relaxed">
            We don't guess, we test. Using INSiGHT Scans, we craft tailored care plans
            for your child's unique neurological needs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ name: 'INSiGHT Scans' }]}
            className="mb-8"
          />
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Power of The Central Nervous System
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Your central nervous system is the command center that coordinates your body's internal
              functions, perceives your environment, and coordinates cell function. It is crucial for
              overall health and well-being.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Understanding how well your nervous system is functioning is essential to creating an
              effective care plan. That's why we use state-of-the-art INSiGHT scanning technology to
              measure your nervous system function accurately and objectively.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            The Three INSiGHT Scans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {scanTypes.map((scan, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-emerald-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <scan.icon size={28} className="text-primary-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{scan.title}</h3>
                <p className="text-gray-700 leading-relaxed">{scan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/insight-scan-1.webp"
                alt="INSiGHT Scan Example"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The CORE Score: Your Health Indicator
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The CORE Score is a comprehensive health score that reflects how well your body
                is adapting to stress. It serves as an indicator of your neurological health and
                overall well-being.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                By combining data from all three INSiGHT scans, we generate your personalized CORE
                Score, which helps us track your progress throughout your care journey and make
                data-driven decisions about your treatment plan.
              </p>
              <div className="bg-emerald-50 border-l-4 border-emerald-700 p-6 rounded-lg">
                <p className="text-lg text-gray-900 font-medium">
                  Regular scanning allows us to monitor changes and optimize your care for the best
                  possible outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <TrendingUp size={48} className="text-emerald-300" />
            </div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Commitment</h2>
            <p className="text-xl text-white/90 text-center leading-relaxed mb-8">
              At Cultivate Wellness Chiropractic, we are committed to providing the highest quality,
              evidence-based care. Our INSiGHT scanning technology ensures that we understand exactly
              what's happening in your nervous system, so we can provide the most effective care
              possible for you and your family.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Non-Invasive & Safe</h3>
                <p className="text-white/90">
                  Our scanning technology is completely safe, non-invasive, and appropriate for
                  patients of all ages, from newborns to seniors.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Objective Measurements</h3>
                <p className="text-white/90">
                  We don't rely on guesswork. Our scans provide objective data about your nervous
                  system function, ensuring precise and personalized care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Experience the Difference
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Discover how INSiGHT scanning technology can help us understand your unique
                neurological needs and create a personalized care plan that addresses the root
                cause of your health concerns.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Whether you're seeking care for yourself or your child, our advanced scanning
                technology ensures we have the information needed to provide the most effective,
                targeted chiropractic care.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/insight-scan-2.webp"
                alt="INSiGHT Technology"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Learn More About Your Nervous System?"
        description="Schedule a consultation to experience our INSiGHT scanning technology and discover how we can help you achieve optimal health."
        buttonText="Schedule Consultation"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
