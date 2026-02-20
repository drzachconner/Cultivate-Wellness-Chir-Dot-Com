import { useRef, useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { SITE } from '../data/site';
import AnimateOnScroll from './AnimateOnScroll';

export default function TestimonialSlider() {
  const testimonials = SITE.testimonials;
  // Duplicate for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials];

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // When hovering, pause animation and switch to scroll-based positioning
  // On mouse leave, resume animation from current visual position
  const syncScrollToAnimation = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Get computed transform to find current animation offset
    const style = getComputedStyle(track);
    const matrix = new DOMMatrix(style.transform);
    const currentX = matrix.m41; // translateX value
    // Convert animation offset to scroll position
    track.parentElement!.scrollLeft = -currentX;
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    syncScrollToAnimation();
  }, [syncScrollToAnimation]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isHovering) return;
    const container = trackRef.current?.parentElement;
    if (!container) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: container.scrollLeft };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isHovering]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const container = trackRef.current?.parentElement;
    if (!container) return;
    const dx = e.clientX - dragStart.current.x;
    container.scrollLeft = dragStart.current.scrollLeft - dx;
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Infinite scroll loop: when scrolled past halfway, jump back
  useEffect(() => {
    if (!isHovering) return;
    const container = trackRef.current?.parentElement;
    if (!container) return;
    const handleScroll = () => {
      const halfWidth = container.scrollWidth / 2;
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += halfWidth;
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isHovering]);

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

      {/* Marquee track — auto-scrolls, drag-scrollable on hover */}
      <div
        className={`relative overflow-x-hidden ${isHovering ? 'overflow-x-auto scrollbar-hide' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: isHovering ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div
          ref={trackRef}
          className={`flex w-max ${isHovering ? '' : 'animate-marquee'}`}
          style={{ userSelect: isDragging ? 'none' : 'auto' }}
        >
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
