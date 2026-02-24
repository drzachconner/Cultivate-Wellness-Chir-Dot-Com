import { ArrowRight } from 'lucide-react';
import { responsiveSrc } from '@drzach/website-toolkit';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) {
  const imgProps = backgroundImage ? responsiveSrc(backgroundImage) : null;

  return (
    <section className={`relative py-20 sm:py-28 ${ backgroundImage ? 'min-h-[500px] flex items-center' : 'bg-white'}`}>
      {backgroundImage && imgProps && (
        <>
          <div className="absolute inset-0 z-0">
            <img
              src={imgProps.src}
              srcSet={imgProps.srcSet}
              sizes={imgProps.sizes}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${ backgroundImage ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        <p className={`text-lg sm:text-xl mb-8 max-w-3xl mx-auto ${ backgroundImage ? 'text-white' : 'text-gray-700'}`}>
          {subtitle}
        </p>
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-accent transition shadow-lg hover:shadow-xl"
          >
            {ctaText}
            <ArrowRight size={20} />
          </a>
        )}
      </div>
    </section>
  );
}
