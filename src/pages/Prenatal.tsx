import { useSeo } from '../hooks/useSeo';
import { SITE } from '../data/site';
import { useEffect } from 'react';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { Heart, Baby, Smile, Activity } from 'lucide-react';
import CTABanner from '../components/CTABanner';

export default function Prenatal() {
  useSeo({
    title: 'Prenatal Chiropractic',
    description: 'Safe, effective chiropractic care for expectant mothers throughout pregnancy.',
    canonical: '/prenatal',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: 'Prenatal', url: `https://${SITE.domain}/prenatal` },
    ]));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: 'Reduce Pregnancy Discomfort',
      description: 'Alleviate back pain, pelvic pain, and sciatic nerve issues naturally.',
    },
    {
      icon: Baby,
      title: 'Optimal Fetal Positioning',
      description: 'Support proper positioning for a smoother delivery experience.',
    },
    {
      icon: Smile,
      title: 'Easier Labor & Delivery',
      description: 'Research shows chiropractic care may reduce labor time and complications.',
    },
    {
      icon: Activity,
      title: 'Better Overall Wellness',
      description: 'Maintain balance, flexibility, and energy throughout your pregnancy.',
    },
  ];

  return (
    <>
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1568043625493-2b0633c7c491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Prenatal Chiropractic Care"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Prenatal
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            The cultivation of a thriving and healthy family starts during the perinatal period. Trained in the Webster Technique along with a gentle, neuro-focused approach, we provide premier care and support for moms from conception to postnatal care.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Prenatal Chiropractic?
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Webster Technique</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <p className="text-gray-700 mb-4">
              We specialize in the Webster Technique, a specific chiropractic analysis and adjustment
              that helps optimize pelvic balance and function during pregnancy.
            </p>
            <p className="text-gray-700 mb-4">
              This gentle technique has been shown to reduce the need for interventions during birth
              and support optimal fetal positioning.
            </p>
            <p className="text-gray-700 font-medium text-primary-dark">
              Safe for all stages of pregnancy and recommended by midwives and OB-GYNs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Pregnancy Issues We Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['Lower Back Pain', 'Pelvic Pain', 'Round Ligament Pain', 'Sciatica', 'Breech Presentation',
              'Hip Discomfort', 'Neck Tension', 'Headaches', 'Postpartum Recovery'].map((condition) => (
              <div key={condition} className="bg-gray-50 p-4 rounded-lg text-center font-medium text-gray-700">
                {condition}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Support Your Pregnancy Journey"
        description="Experience the benefits of prenatal chiropractic care. Book your appointment today."
        buttonText="Schedule Prenatal Care"
        buttonLink={SITE.janeUrlWithUtm}
      />
    </>
  );
}
