import { Phone } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

const days = [
  { day: 'Monday', hours: 'Closed' },
  { day: 'Tuesday', hours: 'Closed' },
  { day: 'Wednesday', hours: 'Closed' },
  { day: 'Thursday', hours: 'Closed' },
  { day: 'Friday', hours: '3:00 PM – 6:30 PM' },
  { day: 'Saturday', hours: '8:00 AM – 1:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export default function OfficeHours() {
  return (
    <AnimateOnScroll>
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            Office Hours
          </h2>

          <div className="mb-8 px-4 py-5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-center text-gray-800 leading-relaxed text-sm">
              <strong className="text-blue-900">New Patients:</strong> We have merged with Van Every Family Chiropractic Center and are no longer accepting new patients at this location. To schedule a new patient appointment with Dr. Zach, please call{' '}
              <a href="tel:+12486160900" className="text-primary-dark font-semibold hover:underline">
                (248) 616-0900
              </a>.<br />
              <span className="text-xs italic mt-1 block">
                Please mention that you were referred by Cultivate Wellness Chiropractic to see Dr. Zach.
              </span>
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            {days.map((item, i) => {
              const isOpen = item.hours !== 'Closed';
              return (
                <div
                  key={item.day}
                  className={`flex items-center justify-between py-3 ${
                    i < days.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className={`text-base ${isOpen ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                    {item.day}
                  </span>
                  <span className={`text-base ${isOpen ? 'font-semibold text-primary-dark' : 'text-gray-300'}`}>
                    {item.hours}
                  </span>
                </div>
              );
            })}

            <a
              href="tel:+12482211118"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-primary-dark text-white py-3 rounded-lg font-semibold hover:bg-primary-accent transition-colors"
            >
              <Phone size={16} />
              (248) 221-1118
            </a>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
