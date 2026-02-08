import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function RHKNGuide() {
  return (
    <>
      <Seo
        title="Raising Healthy Kids Naturally - Free Guide"
        description="Download our free Raising Healthy Kids Naturally guide with valuable insights for your family."
        canonical="/rhkn-guide"
        ogImage="/images/rhkn-guide.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Raising Healthy Kids Naturally', url: `https://${SITE.domain}/rhkn-guide` },
      ])} />
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/rhkn-guide.webp)' }}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            Raising Healthy Kids Naturally
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Get your free guide with expert insights and practical advice for raising healthy kids naturally.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Your Free Guide</h2>
            <p className="text-gray-700 mb-6">
              Fill out the form below to receive your guide instantly.
            </p>
            <iframe
              src="https://form.jotform.com/232755576450159"
              width="100%"
              height="700"
              style={{ border: 0 }}
              title="Raising Healthy Kids Naturally Guide"
            />
          </div>
        </div>
      </section>
    </>
  );
}
