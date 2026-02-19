import { useState, useEffect, useRef } from 'react';
import { Star, X } from 'lucide-react';
import { SITE } from '../data/site';

export default function FloatingReviewWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const reviews = SITE.testimonials;

  useEffect(() => {
    const dismissed = sessionStorage.getItem('reviewWidgetDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Fade out
      setIsFading(true);
      // After fade-out, swap content and fade back in
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % reviews.length;
          setDisplayIndex(next);
          return next;
        });
        requestAnimationFrame(() => {
          setIsFading(false);
        });
      }, 300);
    }, 7000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, reviews.length]);

  const handleDotClick = (index: number) => {
    setIsFading(true);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(index);
      setDisplayIndex(index);
      requestAnimationFrame(() => {
        setIsFading(false);
      });
    }, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('reviewWidgetDismissed', 'true');
  };

  if (!isVisible || reviews.length === 0) return null;

  const review = reviews[displayIndex];
  const formattedDate = new Date(review.datePublished).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Generate initials for avatar
  const initials = review.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on name
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
  const colorIndex = review.name.length % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <>
      {/* Desktop review card - box stays fixed, content fades */}
      <aside
        role="complementary"
        aria-label="Customer reviews"
        className="fixed bottom-4 left-4 z-40 max-w-xs bg-white rounded-lg shadow-xl border border-gray-200 hidden md:block"
        style={{ maxWidth: '280px' }}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 shadow-sm transition-colors"
          aria-label="Close review widget"
        >
          <X size={14} className="text-gray-500" />
        </button>

        <div className={`p-4 transition-opacity duration-300 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Header with avatar, name, date */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{review.name}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          {/* Star rating and Google link */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${SITE.googlePlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              on Google
            </a>
          </div>

          {/* Review text - aria-live for screen reader announcements */}
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-4" aria-live="polite" aria-atomic="true">
            {review.text}
          </p>

          {/* Pagination dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-dark' : 'bg-gray-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile compact review badge */}
      <a
        href={`https://www.google.com/maps/place/?q=place_id:${SITE.googlePlaceId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-40 md:hidden bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2 hover:shadow-xl transition-shadow"
        aria-label="View Google reviews"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-gray-900">4.9</span>
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500">Google</span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDismiss(); }}
          className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss review badge"
        >
          <X size={14} />
        </button>
      </a>
    </>
  );
}
