import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { SITE } from '../data/site';

export default function FloatingReviewWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const reviews = SITE.testimonials;

  useEffect(() => {
    // Check if user has dismissed the widget this session
    const dismissed = sessionStorage.getItem('reviewWidgetDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
        setIsAnimating(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, [isVisible, reviews.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('reviewWidgetDismissed', 'true');
  };

  if (!isVisible || reviews.length === 0) return null;

  const review = reviews[currentIndex];
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
    <aside
      role="complementary"
      aria-label="Customer reviews"
      className={`fixed bottom-24 right-4 z-40 max-w-xs bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 max-md:bottom-36 ${
        isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
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

      <div className="p-4">
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
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
