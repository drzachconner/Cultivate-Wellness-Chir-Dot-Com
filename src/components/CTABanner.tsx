import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from './AnimateOnScroll';

interface CTABannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'primary' | 'secondary';
  isExternal?: boolean;
  showSocialProof?: boolean;
}

export default function CTABanner({
  title,
  description,
  buttonText,
  buttonLink,
  variant = 'primary',
  isExternal = false,
  showSocialProof = false,
}: CTABannerProps) {
  const bgColor = variant === 'primary' ? 'bg-primary-dark' : 'bg-primary';
  const hoverColor = variant === 'primary' ? 'hover:bg-primary-accent' : 'hover:bg-primary-dark';
  const buttonClasses = `inline-flex items-center gap-2 bg-white text-primary-dark px-8 py-4 rounded-lg text-lg font-medium ${hoverColor} hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`;

  return (
    <AnimateOnScroll>
      <section className={`${bgColor} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">{description}</p>
          {isExternal ? (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              {buttonText}
              <ArrowRight size={20} />
            </a>
          ) : (
            <Link to={buttonLink} className={buttonClasses}>
              {buttonText}
              <ArrowRight size={20} />
            </Link>
          )}
          {showSocialProof && (
            <div className="flex items-center justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-blue-200 font-medium">
                Rated 4.9/5 from 100+ Google Reviews
              </span>
            </div>
          )}
        </div>
      </section>
    </AnimateOnScroll>
  );
}
