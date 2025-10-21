import { useSeo } from '../hooks/useSeo';
import { SITE } from '../data/site';
import { useEffect } from 'react';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { MapPin, Phone, Globe } from 'lucide-react';

export default function NewPatientCenter() {
  useSeo({
    title: 'New Patient Center',
    description: 'Everything you need to know before your first visit to Cultivate Wellness Chiropractic.',
    canonical: '/new-patient-center',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: 'New Patient Center', url: `https://${SITE.domain}/new-patient-center` },
    ]));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <section className="relative py-32 bg-gray-900 min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593612605566-fc2e271cb68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="New Patient Center"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            New Patient Information
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
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
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Schedule Online</h4>
                    <a
                      href="https://www.vaneverychiropractic.com/contact-us/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 text-lg hover:underline block mb-2"
                    >
                      Visit Van Every Chiropractic Contact Page
                    </a>
                    <p className="text-gray-600 text-sm">
                      Schedule your appointment online or learn more about our services
                    </p>
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
