import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimateOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

export default function AnimateOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useScrollAnimation();

  const directionStyles = {
    up: 'translate-y-8',
    left: '-translate-x-8',
    right: 'translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionStyles[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
