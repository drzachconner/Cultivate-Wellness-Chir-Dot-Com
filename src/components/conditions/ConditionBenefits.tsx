import { resolveIcon } from '../../data/conditions/icon-map';

interface BenefitsData {
  sectionTitle: string;
  items: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

interface ConditionBenefitsProps {
  data: BenefitsData;
}

export default function ConditionBenefits({ data }: ConditionBenefitsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {data.sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.items.map((item, index) => {
            const Icon = resolveIcon(item.icon);
            return (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-primary-dark" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
