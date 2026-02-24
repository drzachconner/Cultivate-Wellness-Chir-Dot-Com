import { SITE } from '../data/site';
import { Link } from 'react-router-dom';
import { breadcrumbJsonLd } from '@drzach/website-toolkit';
import { Download } from 'lucide-react';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function FreeGuidesForParents() {
  const guides = [
    {
      title: 'Raising Healthy Kids Naturally',
      description: 'Discover natural approaches to support your child\'s overall health and wellness.',
      image: '/images/rhkn-guide.webp',
      link: '/rhkn-guide',
    },
    {
      title: '3 Ways to Improve Your Child\'s Sleep',
      description: 'Simple, effective strategies to help your child sleep better naturally.',
      image: '/images/sleep-guide.webp',
      link: '/3-ways-to-sleep',
    },
    {
      title: '3 Ways to Get Your Child Pooping',
      description: 'Natural solutions to support your child\'s digestive health and regularity.',
      image: '/images/pooping-guide.webp',
      link: '/3-ways-to-poop',
    },
  ];

  return (
    <>
      <Seo
        title="Free Guides for Parents"
        description="Download free guides to help your child thrive. Expert advice on sleep, digestion, and natural wellness."
        canonical="/free-guides-for-parents"
        ogImage="/images/guides-hero-new.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Free Guides for Parents', url: `https://${SITE.domain}/free-guides-for-parents` },
      ])} />
      <section className="relative py-32 bg-gray-900 min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/guides-hero-new.webp"
            alt="Free Guides for Parents"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/50 to-primary/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Free Guides for Parents
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            Download our expert guides to help your child thrive naturally. From better sleep to healthy digestion, we're here to support your family's wellness journey.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <Link
                key={index}
                to={guide.link}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Download className="text-primary-dark flex-shrink-0 mt-1" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-dark transition-colors">
                      {guide.title}
                    </h2>
                  </div>
                  <p className="text-gray-700 mb-4">{guide.description}</p>
                  <span className="inline-block text-primary-dark font-medium group-hover:text-primary-accent">
                    Download Free Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Natural Health Care?
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            At Cultivate Wellness Chiropractic, we believe in empowering parents with knowledge and natural solutions. Our guides are based on years of clinical experience helping families like yours achieve optimal health without drugs or invasive procedures.
          </p>
          <Link
            to="/about-us"
            className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-lg"
          >
            Learn More About Our Approach
          </Link>
        </div>
      </section>
    </>
  );
}
