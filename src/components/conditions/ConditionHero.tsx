import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Home } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getGroupedConditions } from '../../data/conditions';

interface ConditionHeroProps {
  title: string;
  subtitle: string;
  image: string;
  breadcrumbLabel: string;
}

export default function ConditionHero({ title, subtitle, image, breadcrumbLabel }: ConditionHeroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const groups = getGroupedConditions();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <section className="relative py-32 bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
      {/* Breadcrumb pinned to top of hero */}
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
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Conditions
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
                  <Link
                    to="/conditions"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gray-50 border-b border-gray-100 flex-shrink-0"
                  >
                    View All Conditions
                  </Link>
                  <div className="max-h-64 overflow-y-auto">
                    {groups.map((group) => (
                      <div key={group.category}>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/conditions#${group.category}`);
                            setTimeout(() => {
                              const el = document.getElementById(group.category);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 150);
                          }}
                          className="block w-full text-left px-4 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 hover:text-primary-dark hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          {group.label}
                        </button>
                        {group.conditions.map((c) => (
                          <Link
                            key={c.slug}
                            to={`/conditions/${c.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-primary-light/10 hover:text-primary-dark transition-colors"
                          >
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/conditions"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gray-50 border-t border-gray-100 flex-shrink-0"
                  >
                    View All Conditions
                  </Link>
                </div>
              )}
            </div>
          </li>
          <li className="flex items-center">
            <ChevronRight size={16} className="mx-1 text-white/50" aria-hidden="true" />
            <span className="text-white font-medium" aria-current="page">{breadcrumbLabel}</span>
          </li>
        </ol>
      </nav>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
          {title}
        </h1>
        <p className="text-lg text-white text-center max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
