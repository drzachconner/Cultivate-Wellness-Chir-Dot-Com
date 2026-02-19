import { useEffect, useState } from 'react';
import { X, MapPin, Phone, ExternalLink, ArrowRight } from 'lucide-react';

export default function MergerNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const hasSeenNotification = sessionStorage.getItem('hasSeenMergerNotification');
    if (!hasSeenNotification) {
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenMergerNotification', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile: Small floating bar - non-intrusive */}
      <div className="md:hidden fixed bottom-20 left-4 right-20 z-40 animate-slide-in">
        <div
          className="flex items-center justify-between gap-2 px-3 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: '#002d4e' }}
        >
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 text-white text-sm font-medium flex-1"
          >
            <span>We've merged!</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Mobile: Full-screen modal when expanded */}
      {isExpanded && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div
              className="sticky top-0 p-4 flex items-center justify-between"
              style={{ backgroundColor: '#002d4e' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/images/van-every-logo.png"
                  alt="Van Every Family Chiropractic Center"
                  className="h-8 w-auto bg-white rounded px-2 py-1"
                />
                <p className="text-white font-bold text-sm">We've Merged!</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/20 rounded p-1 transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Dr. Zach has merged with Van Every Family Chiropractic Center
                </h3>
                <p className="text-sm text-gray-600">
                  Schedule your care with Dr. Zach at our new Royal Oak location.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <a
                  href="tel:+1-248-616-0900"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Phone size={20} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">(248) 616-0900</p>
                    <p className="text-xs text-gray-600">Mention Cultivate Wellness</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={20} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">4203 Rochester Rd</p>
                    <p className="text-xs text-gray-600">Royal Oak, MI 48073</p>
                  </div>
                </div>

                <a
                  href="https://www.vaneverychiropractic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <ExternalLink size={20} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">vaneverychiropractic.com</p>
                    <p className="text-xs text-gray-600">Visit website</p>
                  </div>
                </a>
              </div>

              <button
                onClick={handleClose}
                className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: '#002d4e' }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Original card design - centered at bottom */}
      <div className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-sm animate-slide-in">
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 transition-all duration-300"
          style={{ borderColor: '#002d4e' }}
        >
          <div
            className="p-4 flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: '#002d4e' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/van-every-logo.png"
                alt="Van Every Family Chiropractic Center"
                className="h-10 w-auto bg-white rounded px-2 py-1"
              />
              <div className="text-white">
                <p className="font-bold text-sm">We've Merged!</p>
                {!isExpanded && <p className="text-xs opacity-90">Click to learn more</p>}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-white hover:bg-white/20 rounded p-1 transition ml-2"
              aria-label="Close notification"
            >
              <X size={20} />
            </button>
          </div>

          {isExpanded && (
            <div className="p-4 space-y-4">
              <img
                src="/images/van-every-header.png"
                alt="Van Every Chiropractic"
                className="w-full h-auto rounded"
              />

              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Dr. Zach has merged with Van Every Family Chiropractic Center
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Schedule your care with Dr. Zach at our new Royal Oak location.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a
                      href="tel:+1-248-616-0900"
                      className="hover:underline"
                      style={{ color: '#002d4e' }}
                    >
                      (248) 616-0900
                    </a>
                    <p className="text-xs text-gray-600 mt-1">
                      Mention you're being referred from Cultivate Wellness Chiropractic to see Dr. Zach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">
                      4203 Rochester Rd<br />
                      Royal Oak, MI 48073
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ExternalLink className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#002d4e' }} />
                  <div>
                    <p className="font-semibold text-gray-900">Website</p>
                    <a
                      href="https://www.vaneverychiropractic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: '#002d4e' }}
                    >
                      vaneverychiropractic.com
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full text-white py-2 rounded font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: '#002d4e' }}
              >
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
