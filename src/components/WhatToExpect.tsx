import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    title: 'Your First Visit — Neurological Assessment',
    image: '/images/insight-scan-1.webp',
    imageAlt: 'INSiGHT neurological scan being performed',
    description:
      'Non-invasive INSiGHT neurological scans measure how the nervous system is functioning — including thermal, EMG, and HRV readings. These painless scans take just minutes and give Dr. Zach a clear picture of stress patterns in your child\'s (or your) nervous system.',
    expandedTitle: 'About the INSiGHT Scans',
    expandedContent: [
      'Thermal Scan — Measures temperature differences along the spine, revealing areas where the autonomic nervous system may be under stress.',
      'Surface EMG (sEMG) — Measures muscle tension and energy expenditure along the spine, showing how hard the body is working to maintain posture and balance.',
      'Heart Rate Variability (HRV) — Measures the adaptability of the nervous system, indicating how well the body handles and recovers from stress.',
    ],
  },
  {
    number: '02',
    title: 'Your Second Visit — Report of Findings & First Adjustment',
    image: '/images/insight-report.jpeg',
    imageAlt: 'INSiGHT neurological scan report showing CORESCORE results',
    description:
      'Dr. Zach walks you through your scan results in detail, explains what the findings mean, presents a personalized care plan tailored to your family\'s needs, and — if appropriate — performs your first gentle Talsky Tonal adjustment.',
    expandedTitle: 'What to Expect During Your Report',
    expandedContent: [
      'A detailed walkthrough of your INSiGHT scan results with easy-to-understand visuals showing exactly where stress patterns exist in the nervous system.',
      'A personalized care plan outlining recommended visit frequency, expected milestones, and how progress will be tracked with follow-up scans.',
      'Your first gentle Talsky Tonal adjustment — a low-force, neurologically-focused technique that works with the body\'s natural rhythms. Most patients describe it as deeply relaxing.',
    ],
  },
];

function Accordion({ title, items }: { title: string; items: string[] }) {
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
              Your journey to better health starts with understanding. Here's what your first two visits look like.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <AnimateOnScroll key={step.number} delay={index * 200}>
              <div
                className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? 'md:direction-rtl' : ''
                }`}
              >
                {/* Image - left on even, right on odd (desktop) */}
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="relative">
                    <span className="absolute -top-4 -left-2 text-7xl font-bold text-primary-dark/10 select-none z-0">
                      {step.number}
                    </span>
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="relative z-10 rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text - right on even, left on odd (desktop) */}
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                  <Accordion title={step.expandedTitle} items={step.expandedContent} />
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
