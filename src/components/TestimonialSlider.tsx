import { Star } from 'lucide-react';
import { SITE } from '../data/site';
import AnimateOnScroll from './AnimateOnScroll';

export default function TestimonialSlider() {
  const testimonials = SITE.testimonials;
  // Duplicate for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from families we've helped
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-600 font-medium">
              5-Star Rated on Google
            </span>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Marquee track */}
      <div className="group relative">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] w-max">
          {doubled.map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="flex-shrink-0 w-[350px] mx-3"
            >
              <div className="bg-white p-8 rounded-xl shadow-sm hover:bg-primary-dark transition-colors duration-300 group/card h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 group-hover/card:text-white/90 transition-colors duration-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="text-gray-900 group-hover/card:text-white transition-colors duration-300 font-semibold">
                  {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
