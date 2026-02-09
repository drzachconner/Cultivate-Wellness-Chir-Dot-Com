import { Phone, Calendar, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/site';

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-primary-dark shadow-2xl">
      <div className="grid grid-cols-3 gap-px bg-gray-200">
        <a
          href={`tel:${SITE.phone}`}
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-primary-light/10 transition"
          aria-label="Call us"
        >
          <Phone size={20} className="text-primary-dark mb-1" />
          <span className="text-xs font-semibold text-gray-900">Call</span>
        </a>

        <Link
          to="/schedule-appointment"
          className="flex flex-col items-center justify-center py-3 bg-primary-dark hover:bg-primary-accent transition"
          aria-label="Book appointment"
        >
          <Calendar size={20} className="text-white mb-1" />
          <span className="text-xs font-bold text-white">Book Now</span>
        </Link>

        <Link
          to="/contact-us"
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-primary-light/10 transition"
          aria-label="Contact us"
        >
          <Mail size={20} className="text-primary-dark mb-1" />
          <span className="text-xs font-semibold text-gray-900">Email</span>
        </Link>
      </div>
    </div>
  );
}
