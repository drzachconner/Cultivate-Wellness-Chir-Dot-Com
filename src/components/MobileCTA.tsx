import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleChatToggle = (e: Event) => {
      setChatOpen((e as CustomEvent).detail.isOpen);
    };
    window.addEventListener('chatbot-toggle', handleChatToggle);
    return () => window.removeEventListener('chatbot-toggle', handleChatToggle);
  }, []);

  if (!isVisible || chatOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <Link
        to="/schedule-appointment"
        className="flex items-center justify-center gap-2 py-3.5 bg-primary-dark hover:bg-primary-accent transition text-white"
        aria-label="Book appointment"
      >
        <Calendar size={20} />
        <span className="text-sm font-bold">Book Now</span>
      </Link>
    </div>
  );
}
