import { SITE } from '../data/site';
import Seo from '../components/Seo';

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Privacy policy and disclaimer for Cultivate Wellness Chiropractic."
        canonical="/privacy"
        ogImage="/images/hero-family.webp"
      />
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Your privacy is important to us. This policy outlines how we handle your information.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Name, email address, phone number, and contact information</li>
              <li>Health history and medical information relevant to your care</li>
              <li>Insurance information (when applicable)</li>
              <li>Appointment and treatment records</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">How We Use Your Information</h3>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Provide, maintain, and improve our chiropractic services</li>
              <li>Schedule appointments and send appointment reminders</li>
              <li>Process insurance claims and billing</li>
              <li>Communicate with you about your care and our services</li>
              <li>Comply with legal obligations and HIPAA requirements</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Information Security</h3>
            <p className="text-gray-700 mb-6">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. All protected health information (PHI) is handled in compliance with
              HIPAA regulations.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Your Rights</h3>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Access and review your health information</li>
              <li>Request corrections to your information</li>
              <li>Request restrictions on how your information is used</li>
              <li>Receive a copy of your health records</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Contact Us</h3>
            <p className="text-gray-700 mb-6">
              If you have questions about this Privacy Policy or how we handle your information,
              please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <p className="text-gray-700 mb-2">
                <strong>{SITE.name}</strong>
              </p>
              <p className="text-gray-700 mb-2">{SITE.address.street}</p>
              <p className="text-gray-700 mb-2">
                {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
              </p>
              <p className="text-gray-700 mb-2">
                Phone: <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="text-primary-dark hover:underline">{SITE.phone}</a>
              </p>
              <p className="text-gray-700">
                Email: <a href={`mailto:${SITE.email}`} className="text-primary-dark hover:underline">{SITE.email}</a>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The information provided on this website is for general informational purposes only
              and is not intended as medical advice. Always seek the advice of your physician or
              other qualified health provider with any questions you may have regarding a medical
              condition.
            </p>
            <p className="text-gray-700 mb-4">
              The content on this website should not be used for diagnosing or treating a health
              problem or disease. If you have or suspect you have a health problem, you should
              consult your healthcare provider.
            </p>
            <p className="text-gray-700">
              Results may vary from person to person. Chiropractic care is individualized to each
              patient's unique needs and condition.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
