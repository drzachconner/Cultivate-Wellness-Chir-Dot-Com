import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { Calendar, Clock, Phone } from 'lucide-react';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function RequestAppointment() {
  return (
    <>
      <Seo
        title="Request an Appointment"
        description="Schedule your chiropractic appointment online or call us today."
        canonical="/request-an-appointment"
        ogImage="/images/schedule-hero.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Request Appointment', url: `https://${SITE.domain}/request-an-appointment` },
      ])} />
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            Request an Appointment
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Schedule your visit online or give us a call. We look forward to seeing you!
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Schedule Your Appointment</h2>
              <p className="text-gray-700 mb-6 text-center">
                Fill out the form below or call us at <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="text-primary-dark font-medium hover:underline">{SITE.phone}</a>
              </p>
              <iframe
                src="https://form.jotform.com/232578527282161"
                width="100%"
                height="700"
                style={{ border: 0 }}
                title="Request Appointment"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Office Hours</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <Clock size={24} className="text-primary-dark flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  {SITE.hours.display.map((hour) => (
                    <p key={hour} className="text-gray-700 text-lg">
                      {hour}
                    </p>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Same-day appointments often available. Emergency care accommodated whenever
                  possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What to Expect at Your Appointment
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">New Patients</h3>
              <p className="text-gray-700">
                Your first visit includes a comprehensive consultation, examination, and if
                appropriate, your first adjustment. Plan for 45-60 minutes.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Returning Patients</h3>
              <p className="text-gray-700">
                Follow-up visits are typically 15-30 minutes and focus on your continued progress
                and adjustments as needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
