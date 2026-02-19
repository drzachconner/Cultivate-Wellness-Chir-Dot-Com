import { useEffect, useState, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { label: 'Google Rating', value: 5.0, suffix: '', decimals: 1 },
  { label: 'Google Reviews', value: 100, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
  { label: 'Families Served', value: 1000, suffix: '+' },
];

function CountUp({ target, decimals = 0, suffix, started }: { target: number; decimals?: number; suffix: string; started: boolean }) {
  const [current, setCurrent] = useState(0);

  const animate = useCallback(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, target]);

  useEffect(() => {
    animate();
  }, [animate]);

  const display = decimals > 0
    ? current.toFixed(decimals)
    : Math.floor(current).toLocaleString();

  return <>{display}{suffix}</>;
}

export default function StatsBar() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="bg-primary-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <CountUp
                  target={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  started={isVisible}
                />
              </div>
              <div className="text-sm text-blue-200 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
