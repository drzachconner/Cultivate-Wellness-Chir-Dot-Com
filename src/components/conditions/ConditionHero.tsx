import Breadcrumbs from '../Breadcrumbs';

interface ConditionHeroProps {
  title: string;
  subtitle: string;
  image: string;
  breadcrumbLabel: string;
}

export default function ConditionHero({ title, subtitle, image, breadcrumbLabel }: ConditionHeroProps) {
  return (
    <section className="relative py-32 bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/70 to-primary/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Conditions', href: '/conditions' },
            { name: breadcrumbLabel },
          ]}
          className="mb-6 text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
          {title}
        </h1>
        <p className="text-lg text-white text-center max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
