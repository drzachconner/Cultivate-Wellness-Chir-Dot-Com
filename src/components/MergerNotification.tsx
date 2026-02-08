import { useEffect, useState } from 'react';
import { X, MapPin, Phone, ExternalLink } from 'lucide-react';

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
    <div className="fixed bottom-[340px] right-4 z-40 max-w-sm animate-slide-in max-md:bottom-[400px]">
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 transition-all duration-300"
        style={{ borderColor: '#053e67' }}
      >
        <div
          className="p-4 flex items-center justify-between cursor-pointer"
          style={{ backgroundColor: '#053e67' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <img
              src="https://doc.vortala.com/childsites/uploads/3035/files/logo2.png"
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
              src="https://doc.vortala.com/childsites/uploads/3035/files/img-header-new.png"
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
                <Phone className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#053e67' }} />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a
                    href="tel:+1-248-616-0900"
                    className="hover:underline"
                    style={{ color: '#053e67' }}
                  >
                    (248) 616-0900
                  </a>
                  <p className="text-xs text-gray-600 mt-1">
                    Mention you're being referred from Cultivate Wellness Chiropractic to see Dr. Zach.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#053e67' }} />
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">
                    4203 Rochester Rd<br />
                    Royal Oak, MI 48073
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ExternalLink className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#053e67' }} />
                <div>
                  <p className="font-semibold text-gray-900">Website</p>
                  <a
                    href="https://www.vaneverychiropractic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: '#053e67' }}
                  >
                    vaneverychiropractic.com
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full text-white py-2 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: '#053e67' }}
            >
              Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
