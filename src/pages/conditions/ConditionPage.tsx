import Seo from '../../components/Seo';
import JsonLd from '../../components/JsonLd';
import CTABanner from '../../components/CTABanner';
import { SITE } from '../../data/site';
import { breadcrumbJsonLd } from '../../lib/breadcrumbs';
import { medicalWebPageSchema, faqSchema } from '../../lib/schema';
import type { ConditionPageData } from '../../data/conditions/types';
import ConditionHero from '../../components/conditions/ConditionHero';
import ConditionBenefits from '../../components/conditions/ConditionBenefits';
import ConditionSymptoms from '../../components/conditions/ConditionSymptoms';
import ConditionApproach from '../../components/conditions/ConditionApproach';
import ConditionOutcomes from '../../components/conditions/ConditionOutcomes';
import ConditionFAQ from '../../components/conditions/ConditionFAQ';
import RelatedConditions from '../../components/conditions/RelatedConditions';
import { resolveIcon } from '../../data/conditions/icon-map';

interface Props {
  data: ConditionPageData;
}

export default function ConditionPage({ data }: Props) {
  const heroImage = data.heroImage || '/images/hero-family.webp';
  const ctaTitle = data.cta?.title || `Start Your ${data.title} Care Today`;
  const ctaDesc = data.cta?.description || `Schedule a consultation with ${SITE.doctor.fullName} to discuss how chiropractic care can help.`;
  const ctaButton = data.cta?.buttonText || 'Book Your Appointment';

  const HighlightIcon = data.highlightBox?.icon ? resolveIcon(data.highlightBox.icon) : null;

  return (
    <>
      <Seo
        title={data.seo.title}
        description={data.seo.description}
        canonical={`/conditions/${data.slug}`}
        ogImage={heroImage}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: 'Conditions', url: `https://${SITE.domain}/conditions` },
          { name: data.title, url: `https://${SITE.domain}/conditions/${data.slug}` },
        ])}
      />
      <JsonLd
        data={medicalWebPageSchema({
          headline: data.title,
          description: data.seo.description,
          image: heroImage,
          datePublished: data.schema?.datePublished || '2026-02-12',
          dateModified: data.schema?.dateModified || '2026-02-12',
          author: SITE.doctor.fullName,
          url: `/conditions/${data.slug}`,
          condition: data.schema?.condition,
          therapy: data.schema?.therapy,
          wordCount: data.schema?.wordCount,
        })}
      />
      {data.faqs && data.faqs.length > 0 && (
        <JsonLd data={faqSchema(data.faqs)} />
      )}

      <ConditionHero
        title={data.title}
        subtitle={data.subtitle}
        image={heroImage}
        breadcrumbLabel={data.title}
      />

      {/* Intro Section */}
      {data.intro.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {data.intro.map((paragraph, i) => (
                <p key={i} className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlight Box */}
      {data.highlightBox && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-primary-light/10 border border-primary-light/30 rounded-xl p-8">
              {HighlightIcon && (
                <div className="bg-primary-light/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <HighlightIcon size={20} className="text-primary-dark" />
                </div>
              )}
              <p className="text-sm font-semibold text-primary-dark uppercase tracking-wide mb-2">
                {data.highlightBox.label}
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">{data.highlightBox.text}</p>
            </div>
          </div>
        </section>
      )}

      {data.symptoms && <ConditionSymptoms data={data.symptoms} currentSlug={data.slug} />}
      {data.benefits && <ConditionBenefits data={data.benefits} />}
      {data.approach && <ConditionApproach data={data.approach} />}
      {data.outcomes && <ConditionOutcomes data={data.outcomes} />}
      {data.faqs && data.faqs.length > 0 && <ConditionFAQ faqs={data.faqs} />}
      {data.relatedConditions && data.relatedConditions.length > 0 && (
        <RelatedConditions conditions={data.relatedConditions} />
      )}

      <CTABanner
        title={ctaTitle}
        description={ctaDesc}
        buttonText={ctaButton}
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
