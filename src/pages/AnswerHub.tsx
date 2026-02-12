import { SITE } from '../data/site';
import { Link } from 'react-router-dom';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { faqSchema, articleSchema } from '../lib/schema';
import { HelpCircle, Baby, Users, Heart } from 'lucide-react';
import AuthorByline from '../components/AuthorByline';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function AnswerHub() {
  const categories = [
    {
      icon: Baby,
      title: 'Pediatric Care',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: Heart,
      title: 'Prenatal Care',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      icon: Users,
      title: 'Family Care',
      color: 'bg-primary-light/20 text-primary-dark',
    },
  ];

  const faqs = [
    {
      question: 'Is chiropractic care safe for infants and children?',
      answer: 'Yes, pediatric chiropractic care is extremely safe when performed by a trained professional. Dr. Zach uses gentle, specialized techniques appropriate for infants and children. The adjustments are very light - about the pressure you would use to test a tomato for ripeness. Research shows pediatric chiropractic care has an excellent safety record.',
      category: 'Pediatric Care',
    },
    {
      question: 'What conditions can chiropractic care help with in children?',
      answer: 'Chiropractic care can support children with colic, reflux, sleep difficulties, ear infections, developmental delays, sensory processing challenges, focus issues, and general wellness. It works by optimizing nervous system function, which controls all body systems. We see remarkable outcomes across a range of conditions.',
      category: 'Pediatric Care',
    },
    {
      question: 'How soon after birth can a baby receive chiropractic care?',
      answer: 'Babies can be checked as early as their first day of life. Birth, even uncomplicated births, can put stress on a newborn\'s spine and nervous system. Early evaluation helps identify and address any tension or misalignment before symptoms develop. Many parents bring their newborns within the first few weeks.',
      category: 'Pediatric Care',
    },
    {
      question: 'What is prenatal chiropractic care?',
      answer: 'Prenatal chiropractic care focuses on maintaining proper pelvic alignment and nervous system function during pregnancy. This supports optimal fetal positioning, reduces discomfort, and can contribute to easier labor and delivery. We use specialized techniques and equipment designed specifically for pregnant women.',
      category: 'Prenatal Care',
    },
    {
      question: 'When should I start prenatal chiropractic care?',
      answer: 'Ideally, before conception or as early in pregnancy as possible. However, pregnant women can benefit from chiropractic care at any stage. Early care establishes optimal pelvic balance from the start, while care later in pregnancy can help prepare the body for birth. Many women continue care throughout their entire pregnancy.',
      category: 'Prenatal Care',
    },
    {
      question: 'Can chiropractic care help with breech presentation?',
      answer: 'Yes, the Webster Technique is a specific chiropractic analysis and adjustment that reduces interference to the nervous system and balances pelvic muscles and ligaments. This optimization of pelvic function may allow the baby to get into the best possible position for birth. Studies show high success rates when applied consistently.',
      category: 'Prenatal Care',
    },
    {
      question: 'What is Talsky Tonal Chiropractic?',
      answer: 'Talsky Tonal Chiropractic is a neurologically-focused, non-manipulative approach that uses a vitalistic, moment-to-moment analysis to find and release accumulated stress patterns in the nervous system. Adjustments use a gentle pressure input with a finger contact — no bone cracking or forceful manipulation. Corrections continue working with your body\'s movements and breathing even after the adjustment, restoring nervous system function naturally.',
      category: 'Family Care',
    },
    {
      question: 'How often will I need to come for adjustments?',
      answer: 'Visit frequency depends on your individual needs and care goals. Initially, more frequent visits (1-2 times per week) help establish positive changes. As your nervous system stabilizes, visits typically become less frequent. Dr. Zach creates custom care plans based on objective measurements from INSiGHT scans, not arbitrary schedules.',
      category: 'Family Care',
    },
    {
      question: 'What are INSiGHT scans?',
      answer: 'INSiGHT scans are state-of-the-art technology that measures nervous system function non-invasively. They assess heart rate variability, muscle tension patterns, and thermal regulation - all indicators of how well your nervous system is functioning. These objective measurements guide care decisions and track progress over time.',
      category: 'Family Care',
    },
    {
      question: 'Do you accept insurance?',
      answer: 'We provide detailed receipts (superbills) that you can submit to your insurance company for potential reimbursement. Many patients find their care is covered through their out-of-network benefits. We also offer flexible payment plans to make care accessible. Contact our office for specific information about your insurance coverage.',
      category: 'Family Care',
    },
  ];

  return (
    <>
      <Seo
        title="Common Questions About Chiropractic Care"
        description="Get answers to frequently asked questions about pediatric, prenatal, and family chiropractic care at Cultivate Wellness Chiropractic."
        canonical="/answers"
        ogImage="/images/family-adjustment.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'Answers', url: `https://${SITE.domain}/answers` },
      ])} />
      <JsonLd data={faqSchema(
        faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))
      )} />
      <JsonLd data={articleSchema({
        headline: 'Common Questions About Chiropractic Care',
        description: 'Comprehensive answers to frequently asked questions about pediatric, prenatal, and family chiropractic care.',
        image: '/images/hero-family.webp',
        datePublished: '2024-01-15',
        dateModified: '2025-10-20',
        author: 'Dr. Zach Conner',
        url: '/answers',
        wordCount: 2800,
      })} />
      <section className="relative py-24 bg-gradient-to-br from-primary-accent to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="mx-auto mb-6 text-white" size={64} />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Common Questions About Chiropractic Care
            </h1>
            <p className="text-xl text-primary-light max-w-3xl mx-auto">
              Get expert answers to your questions about pediatric, prenatal, and family chiropractic care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4`}>
                  <category.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthorByline
            publishDate="2024-01-15"
            modifiedDate="2025-10-20"
          />

          <article className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary-light/20 p-2 rounded-lg">
                      <HelpCircle className="text-primary-dark" size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-3">
                        {faq.category}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h2>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </article>

          <aside className="mt-12 bg-primary-dark rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-primary-light mb-6">
              We're here to help! Contact us directly or schedule a consultation to discuss your specific concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-us"
                className="inline-block bg-white text-primary-dark px-8 py-3 rounded-lg font-bold hover:bg-primary-light/10 transition"
              >
                Contact Us
              </Link>
              <a
                href={SITE.janeUrlWithUtm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-primary transition"
              >
                Schedule Appointment
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
