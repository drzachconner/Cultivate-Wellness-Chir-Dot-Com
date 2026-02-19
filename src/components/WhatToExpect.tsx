import { useState } from 'react';
import { ChevronDown, ScanSearch, ClipboardList, Hand, Sparkles } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

interface Step {
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  expandedTitle: string;
  expandedContent: string[];
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Your First Visit: Neurological Assessment',
    image: '/images/insight-scan-neck.webp',
    imageAlt: 'INSiGHT neurological scan being performed on patient neck',
    description:
      'Non-invasive INSiGHT neurological scans measure how the nervous system is functioning, including thermal, EMG, and HRV readings. These painless scans take just minutes and give our team a clear picture of stress patterns in your child\'s (or your) nervous system.',
    expandedTitle: 'About the INSiGHT Scans',
    expandedContent: [
      'Thermal Scan: Measures temperature differences along the spine, revealing areas where the autonomic nervous system may be under stress.',
      'Surface EMG (sEMG): Measures muscle tension and energy expenditure along the spine, showing how hard the body is working to maintain posture and balance.',
      'Heart Rate Variability (HRV): Measures the adaptability of the nervous system, indicating how well the body handles and recovers from stress.',
    ],
  },
  {
    number: '02',
    title: 'Your Second Visit: Report of Findings & First Adjustment',
    image: '/images/insight-corescore-report.webp',
    imageAlt: 'INSiGHT neurological scan report showing CORESCORE results',
    description:
      'Our team walks you through your scan results in detail, explains what the findings mean, presents a personalized care plan tailored to your family\'s needs, and if appropriate, performs your first gentle Talsky Tonal adjustment.',
    expandedTitle: 'What to Expect During Your Report',
    expandedContent: [
      'A detailed walkthrough of your INSiGHT scan results with easy-to-understand visuals showing exactly where stress patterns exist in the nervous system.',
      'A personalized care plan outlining recommended visit frequency, expected milestones, and how progress will be tracked with follow-up scans.',
      'Your first gentle Talsky Tonal adjustment: a low-force, neurologically-focused technique that works with the body\'s natural rhythms. Most patients describe it as deeply relaxing.',
    ],
  },
];

interface DifferentiatorItem {
  icon: typeof ScanSearch;
  title: string;
  content: string;
}

const differentiators: DifferentiatorItem[] = [
  {
    icon: ScanSearch,
    title: 'Testing, Not Guessing',
    content:
      'Our INSiGHT scans measure stress and tension in the autonomic nervous system with precision, including thermal, surface EMG, and heart rate variability readings. Objective data means we never guess about what\'s going on inside your body.',
  },
  {
    icon: ClipboardList,
    title: 'Care Plans Built For You',
    content:
      'By combining a thorough case history with your INSiGHT scan findings, we create a care plan uniquely tailored to your needs. Every recommendation is backed by data and designed to help your body heal at its own pace.',
  },
  {
    icon: Hand,
    title: 'Gentle Adjustments',
    content:
      'Our tonal adjustments work with your body\'s natural rhythms. No cracking, popping, or twisting required. This gentle, low-force approach is safe for all ages, from newborns to grandparents.',
  },
  {
    icon: Sparkles,
    title: 'Noticeable Results',
    content:
      'Many families notice changes right away: improved breathing, reduced tension, better sleep patterns, and a calmer nervous system. Early shifts show your body is already beginning to function the way it was designed to.',
  },
];

function StepAccordion({ title, items }: { title: string; items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-primary-dark font-semibold text-sm hover:text-primary-accent transition-colors"
      >
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
        {title}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-3 text-sm text-gray-600">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary-dark font-bold mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhatToExpect() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What to Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From the moment you walk into Cultivate Wellness Chiropractic, whether you're a new
              patient or an experienced one, you'll be welcomed into a warm and inviting community.
              Our office is designed to create a calming, home-like atmosphere, ensuring you feel
              comfortable and cared for from the start. We want you to feel like you belong and that
              you're part of our family.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Visit Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <AnimateOnScroll key={step.number} delay={index * 200}>
              <div
                className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? 'md:direction-rtl' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="rounded-2xl shadow-lg w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold text-sm mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                  <StepAccordion title={step.expandedTitle} items={step.expandedContent} />
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-16">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="px-6 text-sm font-heading font-semibold text-primary tracking-widest uppercase">
            What Sets Us Apart
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Differentiator Cards */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {differentiators.map((item, index) => (
            <AnimateOnScroll key={index} delay={index * 100}>
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-primary-dark/10 flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-primary-dark" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
