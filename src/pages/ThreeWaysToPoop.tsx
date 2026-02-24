import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '@drzach/website-toolkit';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import GuideForm from '../components/GuideForm';

export default function ThreeWaysToPoop() {
  return (
    <>
      <Seo
        title="3 Ways to Poop Better - Free Guide"
        description="Download our free guide with practical tips to support healthy digestion and elimination for your child."
        canonical="/3-ways-to-poop"
        ogImage="/images/pooping-guide.webp"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: '3 Ways to Poop Better', url: `https://${SITE.domain}/3-ways-to-poop` },
        ])}
      />

      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/pooping-guide.webp)' }}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            3 Ways to Poop Better
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Get your free guide with practical, natural solutions to support healthy digestion and elimination.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Your Free Guide</h2>
            <p className="text-gray-700 mb-8">
              Discover three simple, effective strategies to support your child's digestive health naturally.
              Fill out the form below to receive your guide instantly via email.
            </p>
            <GuideForm guideId="3-ways-to-poop" />
          </div>
        </div>
      </section>
    </>
  );
}
