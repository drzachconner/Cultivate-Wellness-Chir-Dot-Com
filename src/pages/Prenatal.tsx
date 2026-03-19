import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '@drzach/website-toolkit';
import { medicalWebPageSchema, faqSchema } from '../lib/schema';
import { Heart, Baby, Smile, Activity } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import AuthorByline from '../components/AuthorByline';

const prenatalFaqs = [
  {
    question: 'Is chiropractic care safe during pregnancy?',
    answer: 'Yes, chiropractic care is safe throughout all stages of pregnancy when provided by a trained practitioner. At Cultivate Wellness, Dr. Zach Conner uses the Talsky Tonal technique — a gentle, non-manipulative approach with no forceful adjustments. He is also certified in the Webster Technique through the ICPA (International Chiropractic Pediatric Association). Adjusting tables are adapted for pregnant patients, and care is customized for each trimester.',
  },
  {
    question: 'What is the Webster Technique and how does it help during pregnancy?',
    answer: 'The Webster Technique is a specific chiropractic analysis and adjustment developed for pregnant women. It focuses on reducing sacral and pelvic imbalance by addressing tension in the muscles and ligaments of the pelvis. This gentle approach can help the pelvis achieve better balance and function, which may encourage optimal fetal positioning for a smoother labor and delivery. Dr. Zach is ICPA Webster Certified and uses this technique alongside Talsky Tonal Chiropractic throughout pregnancy.',
  },
  {
    question: 'Can chiropractic care help with pregnancy back pain and sciatica?',
    answer: 'Yes. Back pain, pelvic pain, and sciatica are among the most common complaints during pregnancy, and chiropractic care is one of the safest, most effective natural approaches. By addressing the neurospinal stress contributing to these symptoms — without drugs or surgery — Dr. Zach helps expectant mothers find relief and maintain comfort throughout pregnancy. Many patients report significant improvement after just a few visits.',
  },
  {
    question: 'When should I start prenatal chiropractic care?',
    answer: 'You can begin prenatal chiropractic care at any point during pregnancy — many women start in the first trimester and continue through postpartum recovery. Starting early allows more time to build pelvic balance and nervous system function before the demands of late pregnancy and delivery. Postpartum care is also highly beneficial for recovery, especially after C-sections or challenging deliveries.',
  },
  {
    question: 'Does chiropractic care help after pregnancy too?',
    answer: 'Absolutely. Postpartum chiropractic care supports recovery after the physical demands of pregnancy and childbirth. Whether you had a vaginal delivery or C-section, the body goes through significant changes, and the nervous system and pelvis benefit from re-balancing. Many new mothers also find that chiropractic care helps with postpartum fatigue, sleep support, and breastfeeding challenges related to neck and shoulder tension.',
  },
];

export default function Prenatal() {
  const benefits = [
    {
      icon: Heart,
      title: 'Reduce Pregnancy Discomfort',
      description: (
        <>
          Alleviate{' '}
          <Link to="/conditions/pregnancy-back-pain" className="text-primary-dark underline hover:text-primary-accent">back pain</Link>,{' '}
          pelvic pain, and{' '}
          <Link to="/conditions/sciatica" className="text-primary-dark underline hover:text-primary-accent">sciatic nerve issues</Link>{' '}
          naturally.
        </>
      ),
    },
    {
      icon: Baby,
      title: 'Optimal Fetal Positioning',
      description: 'Support proper positioning for a smoother delivery experience.',
    },
    {
      icon: Smile,
      title: 'Easier Labor & Delivery',
      description: 'Research shows chiropractic care may reduce labor time and complications.',
    },
    {
      icon: Activity,
      title: 'Better Overall Wellness',
      description: 'Maintain balance, flexibility, and energy throughout your pregnancy.',
    },
  ];

  return (
    <>
      <Seo
        title="Prenatal Chiropractor Rochester Hills, MI"
        description="Safe prenatal chiropractic in Rochester Hills using Webster Technique. Relieve back pain, support optimal fetal positioning. Serving expectant mothers!"
        canonical="/prenatal"
        ogImage="/images/prenatal-care.webp"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: 'Prenatal', url: `https://${SITE.domain}/prenatal` },
        ])}
      />
      <JsonLd
        data={medicalWebPageSchema({
          headline: 'Prenatal Chiropractic Care for Expectant Mothers',
          description: 'Safe, gentle chiropractic care for pregnancy including the Webster Technique. Support optimal fetal positioning, reduce pregnancy discomfort, and prepare for easier labor and delivery.',
          image: '/images/prenatal-care.webp',
          datePublished: '2024-01-10',
          dateModified: '2026-03-19',
          author: 'Dr. Zach Conner',
          url: '/prenatal',
          therapy: {
            name: 'Prenatal Chiropractic Care',
            description: 'Gentle chiropractic adjustments and the Webster Technique to support expectant mothers through pregnancy and postpartum recovery',
          },
          wordCount: 800,
        })}
      />
      <JsonLd data={faqSchema(prenatalFaqs)} />

      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="/images/prenatal-care.webp"
            loading="eager"
            alt="Prenatal Chiropractic Care"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Prenatal
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            The cultivation of a thriving and healthy family starts during the perinatal period. Trained in the{' '}
            <Link to="/conditions/webster-technique" className="underline hover:text-primary-light transition-colors">Webster Technique</Link>
            {' '}along with a gentle, neuro-focused approach, we provide premier care and support for moms from conception to{' '}
            <Link to="/conditions/postpartum-recovery" className="underline hover:text-primary-light transition-colors">postnatal care</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Prenatal Chiropractic?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                    <benefit.icon size={24} className="text-primary-dark" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Webster Technique</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <p className="text-gray-700 mb-4">
              During pregnancy, there is inevitably a degree of asymmetry in the tension of the pelvic muscles and ligaments. In conjunction with gentle tonal chiropractic adjustments, we use a specific analysis to identify this imbalance and gently engage certain muscles and ligaments to help restore proper balance and normal function.
            </p>
            <p className="text-gray-700 mb-4">
              Many mothers experience improved comfort, and the technique is often associated with encouraging optimal positioning of the baby.
            </p>
            <p className="text-gray-700 font-medium text-primary-dark">
              Safe for all stages of pregnancy. Our doctors are{' '}
              <Link to="/conditions/webster-technique" className="underline hover:text-primary-accent">ICPA Webster Certified</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Pregnancy Issues We Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {([
              { label: 'Lower Back Pain', slug: 'pregnancy-back-pain' },
              { label: 'Pelvic Pain', slug: 'pregnancy-back-pain' },
              { label: 'Round Ligament Pain', slug: '' },
              { label: 'Sciatica', slug: 'sciatica' },
              { label: 'Pelvic Balance', slug: 'webster-technique' },
              { label: 'Hip Discomfort', slug: '' },
              { label: 'Neck Tension', slug: 'back-neck-pain' },
              { label: 'Headaches', slug: 'headaches-migraines' },
              { label: 'Postpartum Recovery', slug: 'postpartum-recovery' },
            ]).map((condition) =>
              condition.slug ? (
                <Link
                  key={condition.label}
                  to={`/conditions/${condition.slug}`}
                  className="bg-gray-50 p-4 rounded-lg text-center font-medium text-primary-dark hover:bg-primary-light/10 hover:shadow-md transition-all"
                >
                  {condition.label}
                </Link>
              ) : (
                <div key={condition.label} className="bg-gray-50 p-4 rounded-lg text-center font-medium text-gray-700">
                  {condition.label}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthorByline publishDate="2024-01-10" modifiedDate="2026-03-19" />
        </div>
      </section>

      <CTABanner
        title="Support Your Pregnancy Journey"
        description="Experience the benefits of prenatal chiropractic care. Book your appointment today."
        buttonText="Schedule Prenatal Care"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
