import { useSeo } from '../hooks/useSeo';
import { SITE } from '../data/site';
import { useEffect } from 'react';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { MapPin, Phone, Globe } from 'lucide-react';

export default function NewPatientForms() {
  useSeo({
    title: 'New Patient Forms',
    description: 'Important information about scheduling new patient appointments.',
    canonical: '/new-patient-forms',
  });

  useEffect(() => {
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: 'New Patient Forms', url: `https://${SITE.domain}/new-patient-forms` },
    ]));
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(breadcrumbScript);
    };
  }, []);

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            New Patient Information
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Important update about scheduling new patient appointments
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              We've Merged with Van Every Family Chiropractic Center
            </h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              We are no longer accepting new patients at our Rochester Hills location. Dr. Zach has
              merged practices with Van Every Family Chiropractic Center in Royal Oak and is excited
              to continue serving families at this new location.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Schedule with Dr. Zach at Van Every Family Chiropractic Center
            </h3>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Phone className="text-emerald-700" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Call to Schedule</h4>
                    <a
                      href="tel:+1-248-616-0900"
                      className="text-emerald-700 text-2xl font-bold hover:underline block mb-2"
                    >
                      (248) 616-0900
                    </a>
                    <p className="text-gray-700 bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                      <strong>Important:</strong> Please mention you're calling to schedule with Dr. Zach
                      and were referred from Cultivate Wellness Chiropractic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MapPin className="text-emerald-700" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Location</h4>
                    <p className="text-gray-700 text-lg">
                      4203 Rochester Rd<br />
                      Royal Oak, MI 48073
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Globe className="text-emerald-700" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Website</h4>
                    <a
                      href="https://vaneverychiropractic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 text-lg hover:underline"
                    >
                      vaneverychiropractic.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-700 text-white rounded-lg p-6 text-center">
              <p className="text-lg">
                Thank you for your continued trust and support. We look forward to serving you at our
                new location!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
