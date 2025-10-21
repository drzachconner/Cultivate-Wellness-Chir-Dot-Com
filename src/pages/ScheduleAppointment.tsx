import { useSeo } from '../hooks/useSeo';
import { SITE } from '../data/site';
import { useEffect } from 'react';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { MapPin, Phone, Globe, Calendar } from 'lucide-react';

export default function ScheduleAppointment() {
  useSeo({
    title: 'Schedule an Appointment',
    description: 'Schedule your appointment with Dr. Zach at Van Every Family Chiropractic Center in Royal Oak.',
    canonical: '/schedule-appointment',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbJsonLd([
      { name: 'Home', url: `https://${SITE.domain}/` },
      { name: 'Schedule Appointment', url: `https://${SITE.domain}/schedule-appointment` },
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
            src="/images/schedule-hero.webp"
            alt="Schedule Appointment"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-900/70 to-primary-dark/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Schedule an Appointment
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            Continue your care with Dr. Zach at our new location
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
              Dr. Zach has merged practices with Van Every Family Chiropractic Center in Royal Oak
              and is excited to continue serving families at this new location.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 text-white rounded-xl p-8 shadow-lg">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Current Cultivate Wellness Practice Members</h3>
              <p className="text-emerald-50 mb-6 text-center">
                Schedule your appointment at CWC here:
              </p>
              <a
                href={SITE.janeUrlWithUtm}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-emerald-700 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition text-center shadow-md"
              >
                Schedule at CWC
              </a>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-primary-dark text-white rounded-xl p-8 shadow-lg">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Phone size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">New Patients</h3>
              <p className="text-blue-50 mb-6 text-center">
                Call Van Every Chiropractic to schedule your first appointment with Dr. Zach:
              </p>
              <a
                href="tel:+1-248-616-0900"
                className="block w-full bg-white text-blue-900 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center shadow-md mb-4"
              >
                (248) 616-0900
              </a>
              <p className="text-blue-50 mb-4 text-center">
                Or schedule online:
              </p>
              <a
                href="https://www.vaneverychiropractic.com/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-blue-900 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center shadow-md"
              >
                Schedule Online
              </a>
              <p className="text-blue-100 text-sm mt-4 text-center">
                Please mention you're coming from Cultivate Wellness Chiropractic
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Van Every Family Chiropractic Center
            </h3>

            <div className="space-y-4">
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
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=4203+Rochester+Rd+Royal+Oak+MI+48073"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline text-sm mt-2 inline-block"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Phone className="text-emerald-700" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Phone</h4>
                    <a
                      href="tel:+1-248-616-0900"
                      className="text-emerald-700 text-xl font-bold hover:underline"
                    >
                      (248) 616-0900
                    </a>
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
                Thank you for your continued trust and support. We look forward to serving you at our new location!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
