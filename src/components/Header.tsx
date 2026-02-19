import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SITE } from '../data/site';
import { getGroupedConditions } from '../data/conditions';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);
  const [isMobileConditionsOpen, setIsMobileConditionsOpen] = useState(false);
  const location = useLocation();
  const conditionsRef = useRef<HTMLDivElement>(null);
  const conditionsButtonRef = useRef<HTMLButtonElement>(null);

  const groupedConditions = getGroupedConditions();

  const navLinks = [
    { to: '/about-us', label: 'About Us' },
    { to: '/meet-dr-zach', label: 'Meet Dr. Zach' },
    { to: '/talsky-tonal-chiropractic', label: 'Talsky Tonal' },
    { to: '/new-patient-center', label: 'New Patients' },
    { to: '/free-guides-for-parents', label: 'Free Guides' },
    { to: '/contact-us', label: 'Contact' },
  ];

  // Insert "Conditions" after "New Patients" (index 3) in the rendering

  const isActive = (path: string) => location.pathname === path;
  const isConditionsActive = location.pathname.startsWith('/conditions');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        conditionsRef.current &&
        !conditionsRef.current.contains(event.target as Node) &&
        conditionsButtonRef.current &&
        !conditionsButtonRef.current.contains(event.target as Node)
      ) {
        setIsConditionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsConditionsOpen(false);
    setIsMenuOpen(false);
    setIsMobileConditionsOpen(false);
  }, [location.pathname]);

  const navBefore = navLinks.slice(0, 4); // About Us, Meet Dr. Zach, Talsky Tonal, New Patients
  const navAfter = navLinks.slice(4);      // Free Guides, Contact

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-gray-900 px-3 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to content
      </a>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-12">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/logo.webp"
                alt={SITE.name}
                className="h-12 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-8">
              {navBefore.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition whitespace-nowrap ${
                    isActive(link.to)
                      ? 'text-primary-dark border-b-2 border-primary-dark'
                      : 'text-gray-900 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Conditions Dropdown Trigger */}
              <div className="relative">
                <button
                  ref={conditionsButtonRef}
                  onClick={() => setIsConditionsOpen(!isConditionsOpen)}
                  className={`text-sm font-medium transition whitespace-nowrap flex items-center gap-1 ${
                    isConditionsActive
                      ? 'text-primary-dark border-b-2 border-primary-dark'
                      : 'text-gray-900 hover:text-primary'
                  }`}
                >
                  Conditions
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isConditionsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {navAfter.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition whitespace-nowrap ${
                    isActive(link.to)
                      ? 'text-primary-dark border-b-2 border-primary-dark'
                      : 'text-gray-900 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/schedule-appointment"
                className="bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-accent transition whitespace-nowrap"
              >
                Book Appointment
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Conditions Mega-Menu */}
          {isConditionsOpen && (
            <div
              ref={conditionsRef}
              className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border-t border-gray-100 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {groupedConditions.map((group) => (
                  <div key={group.category}>
                    <h3 className="text-sm font-bold text-primary-dark uppercase tracking-wide mb-2">
                      {group.label}
                    </h3>
                    <ul className="space-y-0.5">
                      {group.conditions.map((condition) => (
                        <li key={condition.slug}>
                          <Link
                            to={`/conditions/${condition.slug}`}
                            className="block text-sm text-gray-700 hover:text-primary-dark py-1"
                            onClick={() => setIsConditionsOpen(false)}
                          >
                            {condition.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-6 py-3 text-center">
                <Link
                  to="/conditions"
                  className="text-primary-dark font-semibold text-sm hover:text-primary-accent inline-flex items-center gap-1"
                  onClick={() => setIsConditionsOpen(false)}
                >
                  View All Conditions &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Navigation Overlay + Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-30 xl:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="relative z-40 xl:hidden py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white">
              {navBefore.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.to)
                      ? 'bg-primary-light/10 text-primary-dark'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Conditions Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileConditionsOpen(!isMobileConditionsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${
                    isConditionsActive
                      ? 'bg-primary-light/10 text-primary-dark'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>Conditions</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isMobileConditionsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMobileConditionsOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-3">
                    {groupedConditions.map((group) => (
                      <div key={group.category}>
                        <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wide mb-1 px-4">
                          {group.label}
                        </h4>
                        {group.conditions.map((condition) => (
                          <Link
                            key={condition.slug}
                            to={`/conditions/${condition.slug}`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileConditionsOpen(false);
                            }}
                            className="block px-4 py-1.5 text-sm text-gray-700 hover:text-primary-dark hover:bg-gray-50 rounded"
                          >
                            {condition.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <Link
                      to="/conditions"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileConditionsOpen(false);
                      }}
                      className="block px-4 py-2 text-primary-dark font-semibold text-sm hover:text-primary-accent"
                    >
                      View All Conditions &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {navAfter.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.to)
                      ? 'bg-primary-light/10 text-primary-dark'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/schedule-appointment"
                onClick={() => setIsMenuOpen(false)}
                className="block mx-4 mt-4 bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-accent transition text-center"
              >
                Book Appointment
              </Link>
            </div>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
