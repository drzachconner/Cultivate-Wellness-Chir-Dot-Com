import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import CTABanner from '../components/CTABanner';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen, Heart, Brain } from 'lucide-react';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import WorkshopSignupForm from '../components/WorkshopSignupForm';

export default function EventsWorkshops() {
  const upcomingTopics = [
    {
      icon: Brain,
      title: "Understanding Your Child's Nervous System",
      description: "Learn how the nervous system controls every aspect of your child's development and health."
    },
    {
      icon: Heart,
      title: "Natural Solutions for Common Childhood Issues",
      description: "Discover drug-free approaches to managing colic, sleep issues, and behavioral challenges."
    },
    {
      icon: BookOpen,
      title: "Supporting Development Through Chiropractic Care",
      description: "Understand how chiropractic care supports optimal growth and development from birth."
    },
    {
      icon: Users,
      title: "Pregnancy Wellness & Preparation",
      description: "Learn how to support a healthy pregnancy and prepare for an optimal birth experience."
    },
    {
      icon: Calendar,
      title: "Special Needs Support Through Chiropractic",
      description: "Explore how neurologically-focused care can support children with autism, ADHD, and sensory challenges."
    }
  ];

  return (
    <>
      <Seo
        title="Workshops For Parents"
        description="Join our educational workshops designed to help parents understand chiropractic care and support their children's wellness journey."
        canonical="/events-workshops"
        ogImage="/images/hero-family.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Workshops For Parents', url: `https://${SITE.domain}/events-workshops` },
      ])} />
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6">
            Workshops For Parents
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Educational Events to Support Your Family's Wellness
          </p>
          <p className="text-lg text-center max-w-3xl mx-auto mt-4 text-blue-100">
            We offer educational workshops to help parents understand the power of neurologically-focused chiropractic care and how it can support their family's health and development.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-light/10 border-l-4 border-primary-dark p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We're planning exciting workshops for parents covering topics like:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {upcomingTopics.map((topic, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-dark w-12 h-12 rounded-lg flex items-center justify-center">
                        <topic.icon size={24} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-lg text-gray-700 mt-8 font-medium">
                Check back soon for dates and registration information.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4 text-center">
                Be the First to Know
              </h2>
              <p className="text-lg text-gray-700 mb-8 text-center">
                Sign up to be notified when our next workshop is scheduled.
              </p>
              <WorkshopSignupForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            Why Parent Education Matters
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Cultivate Wellness Chiropractic, we believe that educated parents are empowered parents. Understanding how your child's nervous system works and how chiropractic care supports optimal health gives you the confidence to make informed decisions about your family's wellness.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our workshops are designed to be accessible, informative, and practical. You'll leave with actionable knowledge you can apply immediately to support your child's health and development.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're a new parent, expecting, or navigating challenges with a special needs child, our workshops provide valuable insights and support from our experienced team.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-12 text-center">
            Take the Next Step
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule a Consultation</h3>
              <p className="text-gray-700 mb-6">
                Ready to start your family's wellness journey? Book a consultation with Dr. Zach today.
              </p>
              <a
                href={SITE.janeUrlWithUtm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-accent transition"
              >
                Book Appointment
              </a>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Have Questions?</h3>
              <p className="text-gray-700 mb-6">
                Contact us to learn more about our workshops and how we can support your family.
              </p>
              <Link
                to="/contact-us"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Join Our Community"
        description="Stay connected with Cultivate Wellness and never miss an educational opportunity."
        buttonText="Get In Touch"
        buttonLink="/contact-us"
      />
    </>
  );
}
