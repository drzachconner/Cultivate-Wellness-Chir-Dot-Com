import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import CTABanner from '../components/CTABanner';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { GraduationCap, Heart, Sparkles, Users, Award } from 'lucide-react';

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

      {/* Hero with gradient overlay */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/dr-zach-adjusting.webp"
            alt="Dr. Zach Conner adjusting a patient"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Meet Dr. Zach Conner
          </h1>
          <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto">
            Neurologically-focused chiropractor, certified Talsky Tonal teacher, and passionate advocate for pediatric and family wellness.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Every day since my graduation from Life University in Georgia as a chiropractor, I have been blessed with the opportunity to contribute to the transformative stories and results we see with the help of neurologically-focused chiropractic care. These stories inspire me and reinforce my belief in the potential of the human body to heal and optimize itself. This belief is not theoretical but deeply personal, born from my own experiences with the gentle neurologically-focused approach that I passionately advocate and teach.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">My Chiropractic Journey</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A path driven by passion for the body's innate intelligence and a commitment to gentle, transformative care.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-6 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Life University</h3>
                <p className="text-gray-700 leading-relaxed">
                  My journey as a chiropractor began at Life University, where I attended over 60 seminars on various chiropractic techniques. During this time, I was drawn towards <a href="https://talskytonal.com" target="_blank" rel="noopener noreferrer" className="text-primary-dark font-semibold hover:text-primary-accent underline">Talsky Tonal Chiropractic</a> because of its respect for the intelligence of the body and its highly effective, yet very gentle application.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Talsky Tonal Teacher</h3>
                <p className="text-gray-700 leading-relaxed">
                  My passion for this gentle, neurologically-focused approach led me to become one of only two authorized teachers for this work — bringing advanced expertise in a technique that has profound effects on people of all ages and backgrounds.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fulfilling a Community Need</h3>
                <p className="text-gray-700 leading-relaxed">
                  An internship at a neurologically-focused office with an emphasis on children with special needs solidified my belief in the transformative power of this unique approach. It also revealed a void for this type of life-changing care. I have since dedicated my career to filling this void and becoming a beacon of hope for families in my community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Box */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-primary-light/10 border border-primary-light/30 rounded-xl p-8">
            <div className="bg-primary-light/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-primary-dark" />
            </div>
            <p className="text-sm font-semibold text-primary-dark uppercase tracking-wide mb-2">
              My Mission
            </p>
            <p className="text-lg text-gray-800 leading-relaxed">
              I am on a mission to bring transformative chiropractic care to my community. Whether it's helping a child with special needs, providing whole family care, or adjusting athletes and the elderly, I am dedicated to enhancing the lives of those around me. My mission is to help families thrive and live healthier, happier lives.
            </p>
          </div>
        </div>
      </section>

      {/* Passion Section with Image Overlay */}
      <section className="relative py-16 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/meet-dr-zach-clinic.webp"
            loading="lazy"
            alt="Dr. Zach with family in clinic"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/80 to-primary/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Passionate About Nurturing the Future</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Our children embody the future, and my dedication to providing them with the highest quality of care is boundless. It is a true blessing to have the opportunity to make a difference at such a foundational level.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Continued Dedication</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Every day, I am excited to come to work and serve my community. My passion is helping people heal and optimize their life at a root-cause level in a gentle, yet profound way. I am here to facilitate hope, healing, and never-ending optimization.
              </p>
            </div>
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
