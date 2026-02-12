import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { articleSchema, howToSchema } from '../lib/schema';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import GuideForm from '../components/GuideForm';

export default function ThreeWaysToSleep() {
  return (
    <>
      <Seo
        title="3 Ways to Sleep Better - Free Guide"
        description="Download our free guide with practical tips to support healthy sleep for your child."
        canonical="/3-ways-to-sleep"
        ogImage="/images/sleep-guide.webp"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: '3 Ways to Sleep Better', url: `https://${SITE.domain}/3-ways-to-sleep` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "3 Ways to Improve Your Child's Sleep",
          description: 'Simple, effective strategies to help your child sleep better naturally through chiropractic care and wellness practices.',
          image: '/images/sleep-guide.webp',
          datePublished: '2024-01-01',
          dateModified: '2025-10-20',
          author: 'Dr. Zach Conner',
          url: '/3-ways-to-sleep',
        })}
      />
      <JsonLd
        data={howToSchema({
          name: "3 Ways to Improve Your Child's Sleep",
          description: 'Learn three practical, natural approaches to support healthy sleep patterns in children.',
          image: '/images/sleep-guide.webp',
          totalTime: 'P7D',
          steps: [
            {
              name: 'Optimize Nervous System Function',
              text: 'Address nervous system stress through gentle chiropractic care to help the body naturally regulate sleep cycles.',
            },
            {
              name: 'Establish Consistent Sleep Routines',
              text: "Create calming bedtime rituals and maintain consistent sleep schedules to support your child's natural circadian rhythm.",
            },
            {
              name: 'Create a Sleep-Conducive Environment',
              text: 'Ensure the bedroom is dark, cool, quiet, and free from electronic devices to promote deep, restorative sleep.',
            },
          ],
        })}
      />

      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/sleep-guide.webp)' }}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            3 Ways to Sleep Better
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Get your free guide with practical, natural solutions to support healthy sleep.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Your Free Guide</h2>
            <p className="text-gray-700 mb-8">
              Discover three simple, effective strategies to help your child sleep better naturally.
              Fill out the form below to receive your guide instantly via email.
            </p>
            <GuideForm guideId="3-ways-to-sleep" />
          </div>
        </div>
      </section>
    </>
  );
}
