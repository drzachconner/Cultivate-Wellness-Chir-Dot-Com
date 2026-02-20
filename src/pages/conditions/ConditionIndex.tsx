import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ChevronDown, Home } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Seo from '../../components/Seo';
import JsonLd from '../../components/JsonLd';
import CTABanner from '../../components/CTABanner';
import { SITE } from '../../data/site';
import { breadcrumbJsonLd } from '../../lib/breadcrumbs';
import { getGroupedConditions } from '../../data/conditions';

export default function ConditionIndex() {
  const groups = getGroupedConditions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <Seo
        title="Conditions We Help | Chiropractic Care in Rochester Hills, MI"
        description="Explore the conditions we support at Cultivate Wellness Chiropractic. From pediatric concerns to adult pain, our team provides gentle, neurologically-focused care for the whole family."
        canonical="/conditions"
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: `https://${SITE.domain}/` },
          { name: 'Conditions', url: `https://${SITE.domain}/conditions` },
        ])}
      />

      {/* Hero */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/family-park-sunset.webp"
            alt="Conditions We Help"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        <nav aria-label="Breadcrumb" className="absolute top-4 left-4 sm:left-6 lg:left-8 z-20 text-sm text-white/80">
          <ol className="flex items-center flex-wrap gap-1">
            <li className="flex items-center">
              <Link to="/" className="flex items-center hover:text-white transition-colors" aria-label="Home">
                <Home size={16} />
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="mx-1 text-white/50" aria-hidden="true" />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 text-white font-medium hover:text-white transition-colors"
                >
                  Conditions
                  <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
                    <div className="max-h-64 overflow-y-auto">
                      {groups.map((group) => (
                        <div key={group.category}>
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              const el = document.getElementById(group.category);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                              window.history.replaceState(null, '', `/conditions#${group.category}`);
                            }}
                            className="block w-full text-left px-4 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 hover:text-primary-dark hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {group.label}
                          </button>
                          {group.conditions.map((c) => (
                            <Link
                              key={c.slug}
                              to={`/conditions/${c.slug}`}
                              onClick={() => setIsDropdownOpen(false)}
                              className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary-dark transition-colors"
                            >
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ol>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
            Conditions We Help
          </h1>
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            At Cultivate Wellness, our team provides gentle, neurologically-focused chiropractic care for a wide range of conditions affecting children, expecting mothers, and families.
          </p>
        </div>
      </section>

      {/* Condition Groups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {groups.map((group) => (
            <div key={group.category} id={group.category} className="mb-12 last:mb-0 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary-light/30">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.conditions.map((condition) => (
                  <Link
                    key={condition.slug}
                    to={`/conditions/${condition.slug}`}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-primary-light/10 transition-colors group"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-dark">
                        {condition.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{condition.subtitle}</p>
                    </div>
                    <ArrowRight size={18} className="text-primary-dark flex-shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner
        title="Don't See Your Condition Listed?"
        description={`Contact us to discuss how ${SITE.doctor.fullName} can help with your specific needs.`}
        buttonText="Schedule a Consultation"
        buttonLink="/schedule-appointment"
      />
    </>
  );
}
