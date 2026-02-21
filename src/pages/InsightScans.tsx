import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import { breadcrumbJsonLd } from '../lib/breadcrumbs';
import { medicalWebPageSchema } from '../lib/schema';
import { Activity, Heart, Brain, TrendingUp } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';

export default function InsightScans() {
  const scanTypes = [
    {
      icon: Activity,
      title: 'neuroTHERMAL Scan',
      description: (
        <>
          Measures temperature differences along the spine to identify areas of autonomic nervous system imbalance. These patterns reveal subluxation and dysautonomia — showing us how neurospinal stress is affecting{' '}
          <Link to="/conditions/digestive-gi-issues" className="text-primary-dark underline hover:text-primary-accent">digestive</Link>,{' '}
          <Link to="/conditions/immune-support" className="text-primary-dark underline hover:text-primary-accent">immune</Link>, and hormonal regulation at their neurological root. Quick, painless, and safe for all ages.
        </>
      ),
    },
    {
      icon: Heart,
      title: 'neuroPULSE (HRV) Scan',
      description: (
        <>
          Heart Rate Variability measures your body's ability to adapt to stress by analyzing the balance between your sympathetic ("gas pedal") and parasympathetic ("brake pedal") nervous system. A low HRV score reveals a nervous system stuck in{' '}
          <Link to="/conditions/anxiety-stress" className="text-primary-dark underline hover:text-primary-accent">stress mode</Link> — unable to recover, rest, or heal efficiently. This scan takes just a few minutes and provides a window into your overall resilience.
        </>
      ),
    },
    {
      icon: Brain,
      title: 'neuroCORE (sEMG) Scan',
      description: (
        <>
          Surface electromyography measures the electrical activity in the muscles along your spine, revealing where your body is holding tension, guarding, and wasting energy. Patterns of imbalance here are closely tied to conditions like{' '}
          <Link to="/conditions/adhd-focus-issues" className="text-primary-dark underline hover:text-primary-accent">ADHD</Link>,{' '}
          <Link to="/conditions/anxiety-stress" className="text-primary-dark underline hover:text-primary-accent">anxiety</Link>, and{' '}
          <Link to="/conditions/autism-neurodevelopmental" className="text-primary-dark underline hover:text-primary-accent">neurodevelopmental challenges</Link> — showing us exactly where the nervous system is working too hard or not hard enough.
        </>
      ),
    },
  ];

  return (
    <>
      <Seo
        title="INSiGHT Scans - Comprehensive Neurological Assessment"
        description="Non-invasive, non-radiating INSiGHT neurological scans for the whole family. neuroTHERMAL, neuroPULSE, and neuroCORE scans reveal how your nervous system is truly functioning — from newborns to seniors."
        canonical="/insight-scans"
        ogImage="/images/insight-hero.webp"
      />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: `https://${SITE.domain}/` },
        { name: 'INSiGHT Scans', url: `https://${SITE.domain}/insight-scans` },
      ])} />
      <JsonLd
        data={medicalWebPageSchema({
          headline: 'INSiGHT Scans - Comprehensive Neurological Assessment',
          description: 'Non-invasive, non-radiating INSiGHT scanning technology for objective nervous system assessment. neuroTHERMAL, neuroPULSE (HRV), and neuroCORE (sEMG) scans provide the CORE Score to guide personalized tonal chiropractic care plans for patients of all ages.',
          image: '/images/insight-hero.webp',
          datePublished: '2024-01-10',
          dateModified: '2026-02-21',
          author: 'Dr. Zach Conner',
          url: '/insight-scans',
          therapy: {
            name: 'INSiGHT Nervous System Scanning',
            description: 'Non-invasive neuroTHERMAL, neuroPULSE (HRV), and neuroCORE (sEMG) scanning technology to measure nervous system function and create personalized tonal chiropractic care plans for patients of all ages',
          },
          wordCount: 1200,
        })}
      />

      {/* Hero */}
      <section className="relative py-32 bg-gray-900 min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/insight-hero.webp"
            alt="INSiGHT Scanning Technology"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/80 to-primary/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            INSiGHT Scans
          </h1>
          <p className="text-xl sm:text-2xl text-white max-w-4xl mx-auto leading-relaxed">
            Non-invasive, non-radiating neurological scans that reveal how your
            nervous system is truly functioning — so we never have to guess.
          </p>
        </div>
      </section>

      {/* Intro — Why Objective Measurement Matters */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why We Scan: Seeing What Symptoms Can't Tell Us
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Your nervous system controls and coordinates every function in your body — from
              digestion and immune response to mood, sleep, and how you handle stress. When
              subluxation (neurospinal stress) is present, it disrupts this communication and
              your body begins to compensate. You may not feel it right away, but the effects
              accumulate over time.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              That's why we don't rely on symptoms alone. Symptoms are the last thing to show
              up and the first thing to go away — they're an unreliable measure of how your
              nervous system is actually performing. INSiGHT scans give us an objective,
              reproducible window into what's really happening, so we can build a care plan
              based on data, not guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* Three Scans Grid */}
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary-light/10/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            The Three INSiGHT Scans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {scanTypes.map((scan, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-primary-light/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <scan.icon size={28} className="text-primary-dark" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{scan.title}</h3>
                <p className="text-gray-700 leading-relaxed">{scan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE Score */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/insight-scan-1.webp"
                alt="CORE Score INSiGHT Scan Results"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The CORE Score: Your Neural Efficiency Index
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                By combining the data from all three INSiGHT scans, we generate your
                personalized CORE Score — a single number that reflects how efficiently your
                nervous system is functioning overall. Think of it as a report card for your
                neurospinal health.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The CORE Score moves the conversation from "How do you feel?" to "How is your
                nervous system performing?" This allows us to track real, measurable progress
                over time — not just symptom relief, but genuine improvement in how your body
                adapts, heals, and functions.
              </p>
              <div className="bg-primary-light/10 border-l-4 border-primary-dark p-6 rounded-lg">
                <p className="text-lg text-gray-900 font-medium">
                  Regular re-scanning shows us exactly how your nervous system is responding to
                  care, so we can adjust your plan for the best possible outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe for All Ages */}
      <section className="py-16 bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <TrendingUp size={48} className="text-primary-light" />
            </div>
            <h2 className="text-3xl font-bold mb-8 text-center">Safe for the Whole Family</h2>
            <p className="text-xl text-white/90 text-center leading-relaxed mb-8">
              INSiGHT scans are completely non-invasive and emit zero radiation. There is
              nothing to swallow, no needles, and no discomfort. The scans are safe and
              appropriate for everyone — from newborns just hours old to active seniors.
              That's why we use them as the foundation of every care plan we create.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Non-Invasive & No Radiation</h3>
                <p className="text-white/90">
                  Our scans use surface sensors that simply rest on the skin. There is nothing
                  invasive about the process, and no radiation of any kind is emitted. Parents
                  can hold their baby throughout the entire scan.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Objective & Reproducible</h3>
                <p className="text-white/90">
                  Unlike subjective assessments, INSiGHT scans produce objective, measurable
                  data. This means your results are consistent, comparable over time, and not
                  influenced by how you're feeling on a given day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Scans Reveal */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                From Scan Results to Tonal Adjustments
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Your INSiGHT scan results reveal patterns of neurospinal stress — areas where
                your nervous system is stuck in tension, unable to adapt, or wasting energy on
                compensation. These patterns are what guide our gentle, tonal chiropractic
                adjustments.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Rather than chasing symptoms, we use your scan data to target the specific areas
                of subluxation that are interfering with your body's ability to function, heal,
                and thrive. Whether you're a newborn with birth-related stress, a child
                struggling with focus, or an adult dealing with chronic tension — the scans show
                us where to focus and how to measure your progress.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/insight-scan-2.webp"
                alt="INSiGHT Scan Technology in Use"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to See What Your Nervous System Is Telling Us?"
        description="Schedule a consultation to experience our INSiGHT scanning technology. Discover what's really happening in your nervous system — and what we can do about it."
        buttonText="Schedule Your Scans"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
