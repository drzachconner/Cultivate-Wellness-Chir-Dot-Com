import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function ThreeStepsTransition() {
  useSeo({
    title: '3 Steps to a Smooth Transition - Free Guide',
    description: 'Download our free guide to help your child navigate developmental transitions with confidence.',
    canonical: '/3-steps-transition',
  });

  useEffect(() => {
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: '3 Steps to a Smooth Transition', url: `https://${SITE.domain}/3-steps-transition` },
    ]));
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(breadcrumbScript);
    };
  }, []);

  return (
    <>
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/transitions-guide.webp)' }}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            3 Steps to a Smooth Transition
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Get your free guide to help your child navigate important developmental transitions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Your Free Guide</h2>
            <p className="text-gray-700 mb-6">
              Learn three essential steps to support your child through major life transitions.
              Fill out the form below to receive your guide instantly.
            </p>
            <iframe
              src="https://form.jotform.com/232885887287176"
              width="100%"
              height="700"
              style={{ border: 0 }}
              title="3 Steps to a Smooth Transition Guide"
            />
          </div>
        </div>
      </section>
    </>
  );
}
