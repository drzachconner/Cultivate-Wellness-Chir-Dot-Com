import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us | Rochester Hills Chiropractor"
        description="Contact Cultivate Wellness Chiropractic in Rochester Hills, MI. Call (248) 221-1118 or schedule online. Serving families with gentle, neuro-focused care."
        canonical="/contact-us"
        ogImage="/images/contact-hero.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Contact', url: `https://${SITE.domain}/contact-us` },
      ])} />
      <section className="relative py-32 bg-gray-900 min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contact-hero.webp"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/50 to-primary/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            We'd love to hear from you! Call us (248) 221-1118. Open early mornings, early evenings and Saturdays for your convenience!
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Phone size={24} className="text-primary-dark" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                      className="text-gray-700 hover:text-primary-dark transition"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Mail size={24} className="text-primary-dark" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-gray-700 hover:text-primary-dark transition"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                      <MapPin size={24} className="text-primary-dark" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                    <address className="text-gray-700 not-italic">
                      {SITE.address.street}<br />
                      {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
                    </address>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        SITE.address.street + ', ' + SITE.address.city + ', ' + SITE.address.region
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-dark hover:text-primary-accent font-medium inline-block mt-2"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Clock size={24} className="text-primary-dark" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Office Hours</h3>
                    <div className="text-gray-700">
                      {SITE.hours.display.map((hour) => (
                        <p key={hour}>{hour}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2946.8361896442847!2d-83.16216232404588!3d42.68203007116649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824e81a6e0b0b0b%3A0x1234567890abcdef!2s1460%20Walton%20Blvd%20Suite%20210%2C%20Rochester%20Hills%2C%20MI%2048309!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cultivate Wellness Chiropractic Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
