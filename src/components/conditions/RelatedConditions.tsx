import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

interface RelatedCondition {
  slug: string;
  title: string;
}

interface RelatedConditionsProps {
  conditions: RelatedCondition[];
  backgroundImage?: string;
}

export default function RelatedConditions({ conditions, backgroundImage }: RelatedConditionsProps) {
  return (
    <section className="relative py-16 bg-gray-900">
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/80 to-primary/70" />
        </>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark to-primary" />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Layers size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">
            Related Conditions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {conditions.map((condition) => (
            <Link
              key={condition.slug}
              to={`/conditions/${condition.slug}`}
              className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
            >
              <span className="text-lg font-medium text-white">
                {condition.title}
              </span>
              <ArrowRight size={18} className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
