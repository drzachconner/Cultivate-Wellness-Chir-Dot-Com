import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedCondition {
  slug: string;
  title: string;
}

interface RelatedConditionsProps {
  conditions: RelatedCondition[];
}

export default function RelatedConditions({ conditions }: RelatedConditionsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Related Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {conditions.map((condition) => (
            <Link
              key={condition.slug}
              to={`/conditions/${condition.slug}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-light/10 transition-colors group"
            >
              <span className="text-lg font-medium text-gray-900 group-hover:text-primary-dark">
                {condition.title}
              </span>
              <ArrowRight size={18} className="text-primary-dark flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
