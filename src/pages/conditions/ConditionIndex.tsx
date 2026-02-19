import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../../components/Seo';
import JsonLd from '../../components/JsonLd';
import CTABanner from '../../components/CTABanner';
import Breadcrumbs from '../../components/Breadcrumbs';
import { SITE } from '../../data/site';
import { breadcrumbJsonLd } from '../../lib/breadcrumbs';
import { getGroupedConditions } from '../../data/conditions';

export default function ConditionIndex() {
  const groups = getGroupedConditions();

  return (
    <>
      <Seo
        title="Conditions We Help | Chiropractic Care in Rochester Hills, MI"
        description="Explore the conditions we support at Cultivate Wellness Chiropractic. From pediatric concerns to adult pain, our team provides gentle, neurologically-focused care for the whole family."
        canonical="/conditions"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: 'Conditions', url: `https://${SITE.domain}/conditions` },
        ])}
      />

      {/* Hero */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/family-park-sunset.webp"
            alt="Conditions We Help"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        <Breadcrumbs
          items={[{ name: 'Conditions' }]}
          className="absolute top-4 left-4 sm:left-6 lg:left-8 z-20 text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Conditions We Help
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            At Cultivate Wellness, our team provides gentle, neurologically-focused chiropractic care for a wide range of conditions affecting children, expecting mothers, and families.
          </p>
        </div>
      </section>

      {/* Condition Groups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {groups.map((group) => (
            <div key={group.category} className="mb-12 last:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary-light/30">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.conditions.map((condition) => (
                  <Link
                    key={condition.slug}
                    to={`/conditions/${condition.slug}`}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-primary-light/10 transition-colors group"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-dark">
                        {condition.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{condition.subtitle}</p>
                    </div>
                    <ArrowRight size={18} className="text-primary-dark flex-shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner
        title="Don't See Your Condition Listed?"
        description={`Contact us to discuss how ${SITE.doctor.fullName} can help with your specific needs.`}
        buttonText="Schedule a Consultation"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
