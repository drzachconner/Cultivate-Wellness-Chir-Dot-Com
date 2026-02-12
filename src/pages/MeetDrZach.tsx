import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import CTABanner from '../components/CTABanner';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function MeetDrZach() {
  return (
    <>
      <Seo
        title="Meet Dr. Zach Conner | Rochester Hills Chiropractor"
        description="Dr. Zach Conner, Rochester Hills chiropractor and certified Talsky Tonal teacher. Specializing in pediatric, prenatal & family chiropractic care. Learn more!"
        canonical="/meet-dr-zach"
        ogImage="/images/dr-zach.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Meet Dr. Zach', url: `https://${SITE.domain}/meet-dr-zach` },
      ])} />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <img
              src="/images/dr-zach-adjusting.webp"
              alt="Dr. Zach Conner"
              className="w-64 h-64 mx-auto mb-8 rounded-3xl object-cover"
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            />
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
              Welcome to Cultivate Wellness
            </h1>
            <p className="text-2xl text-gray-700 mb-8">Dr. Zach Conner</p>
          </div>

          <div className="text-left">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Every day since my graduation from Life University in Georgia as a chiropractor, I have been blessed with the opportunity to contribute to the transformative stories and results we see with the help of neurologically-focused chiropractic care. These stories inspire me and reinforce my belief in the potential of the human body to heal and optimize itself. This belief is not theoretical but deeply personal, born from my own experiences with the gentle neurologically-focused approach that I passionately advocate and teach.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                My Chiropractic Journey 🌱
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                I am on a mission to bring this transformative chiropractic care to my community. My journey as a chiropractor began at Life University, where I attended over 60 seminars on various chiropractic techniques. During this time, I was drawn towards <a href="https://talskytonal.com" target="_blank" rel="noopener noreferrer" className="text-primary-dark font-semibold hover:text-primary-accent underline">Talsky Tonal Chiropractic</a> because of its respect for the intelligence of the body and its highly effective, yet very gentle application. It was a passion that led me to become one of only two authorized teachers for this work.
              </p>
            </div>

            <div className="bg-primary-light/10 p-8 rounded-xl">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Fulfilling a Community Need 🌟
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                My love for chiropractic care was further fueled by an internship at a neurologically-focused office with an emphasis on children with special needs. This experience solidified my belief in the transformative power of this unique approach. It also revealed a void for this type of life-changing care. I have since dedicated my career to filling this void and becoming a beacon of hope for the families in my community.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                My Story in Chiropractic
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                My journey into chiropractic care began during my university years. I was drawn to the idea of the body's innate intelligence, its ability to heal itself, and how chiropractic care can optimize this process.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                During my time teaching and practicing Talsky Tonal Chiropractic, I've seen its profound impact on people from all walks of life, and particularly on children with special needs. Inspired by these experiences, my commitment is to extend this life-enhancing care to as many children and families as possible.
              </p>
            </div>

            <div className="bg-primary text-white p-8 rounded-xl">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Passionate about Nurturing the Future
              </h2>
              <p className="text-lg leading-relaxed">
                Our children embody the future, and my dedication to providing them with the highest quality of care is boundless. It is a true blessing to have the opportunity to make a difference at such a foundational level.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Continued Dedication and Passion
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Every day, I am excited to come to work and serve my community. My passion is helping people heal and optimize their life at a root-cause level in a gentle, yet profound way.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether it's helping a child with special needs, providing whole family care, or adjusting athletes and the elderly, I am dedicated to enhancing the lives of those in my community. My mission is to help families thrive and live healthier, happier lives. I am here to facilitate hope, healing, and never-ending optimization.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <img
              src="/images/meet-dr-zach-clinic.webp"
              alt="Dr. Zach with family"
              className="rounded-xl shadow-lg w-full mb-8"
            />
            <p className="text-xl text-gray-700 mb-8">
              Ready to experience the Cultivate Wellness difference? Schedule your consultation today.
            </p>
            <Link
              to="/new-patient-center"
              className="inline-block bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition"
            >
              New Patient Center
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        title="Start Your Wellness Journey Today"
        description="Experience personalized, neurologically-focused chiropractic care for your whole family."
        buttonText="Book Your Appointment"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
