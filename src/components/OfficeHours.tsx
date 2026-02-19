import { Clock } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

const days = [
  { abbr: 'M', name: 'Monday', morning: '—', afternoon: '—' },
  { abbr: 'T', name: 'Tuesday', morning: '—', afternoon: '—' },
  { abbr: 'W', name: 'Wednesday', morning: '—', afternoon: '—' },
  { abbr: 'T', name: 'Thursday', morning: '—', afternoon: '—' },
  { abbr: 'F', name: 'Friday', morning: '—', afternoon: '3:00 - 6:30' },
  { abbr: 'S', name: 'Saturday', morning: '8:00 - 1:00', afternoon: '—' },
];

export default function OfficeHours() {
  return (
    <AnimateOnScroll>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            Office Hours
          </h2>

          <div className="mb-8 px-4 py-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-center text-gray-800 leading-relaxed">
              <strong className="text-blue-900">New Patients:</strong> We have merged with Van Every Family Chiropractic Center and are no longer accepting new patients at this location. To schedule a new patient appointment with Dr. Zach, please call{' '}
              <a href="tel:+12486160900" className="text-primary-dark font-semibold hover:underline">
                (248) 616-0900
              </a>.<br />
              <span className="text-sm italic mt-2 block">
                Please mention that you were referred by Cultivate Wellness Chiropractic to see Dr. Zach.
              </span><br />
              <strong className="text-blue-900 mt-4 block">For Current Practice Members:</strong> These are our office hours for existing patients.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-primary-dark text-white px-6 py-4 flex items-center justify-center gap-2">
              <Clock size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Weekly Schedule</span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[60px_1fr_1fr] text-xs font-bold uppercase tracking-wider text-gray-400 px-6 py-3 border-b border-gray-100">
              <span></span>
              <span className="text-center">Morning</span>
              <span className="text-center">Afternoon</span>
            </div>

            {/* Days */}
            {days.map((day, i) => {
              const isClosed = day.morning === '—' && day.afternoon === '—';
              return (
                <div
                  key={`${day.abbr}-${i}`}
                  className={`grid grid-cols-[60px_1fr_1fr] items-center px-6 py-3 ${
                    i < days.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isClosed ? 'bg-gray-50/50' : ''}`}
                >
                  <span className="font-bold text-gray-900 text-lg">{day.abbr}</span>
                  <span className={`text-center text-sm ${
                    day.morning === '—' ? 'text-gray-300' : 'text-gray-800 font-medium'
                  }`}>
                    {day.morning === '—' ? '—' : day.morning}
                  </span>
                  <span className={`text-center text-sm ${
                    day.afternoon === '—' ? 'text-gray-300' : 'text-gray-800 font-medium'
                  }`}>
                    {day.afternoon === '—' ? '—' : day.afternoon}
                  </span>
                </div>
              );
            })}

            {/* Footer CTA */}
            <a
              href="tel:+12482211118"
              className="block bg-gray-100 hover:bg-gray-200 transition-colors text-center py-4 border-t border-gray-200"
            >
              <span className="text-primary-dark font-bold text-lg">
                Call (248) 221-1118
              </span>
            </a>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
