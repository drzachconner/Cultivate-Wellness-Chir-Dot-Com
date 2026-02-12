import { resolveIcon } from '../../data/conditions/icon-map';

interface SymptomsData {
  sectionTitle: string;
  items: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

interface ConditionSymptomsProps {
  data: SymptomsData;
}

export default function ConditionSymptoms({ data }: ConditionSymptomsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {data.sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, index) => {
            const Icon = resolveIcon(item.icon);
            return (
              <div key={index} className="bg-white p-6 rounded-xl text-center">
                <div className="bg-primary-light/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary-dark" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
