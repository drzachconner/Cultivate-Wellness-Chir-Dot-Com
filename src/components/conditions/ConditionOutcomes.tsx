import { CheckCircle } from 'lucide-react';

interface OutcomesData {
  sectionTitle: string;
  items: string[];
}

interface ConditionOutcomesProps {
  data: OutcomesData;
}

export default function ConditionOutcomes({ data }: ConditionOutcomesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {data.sectionTitle}
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-6 text-center">
            While every individual is unique and results vary, families frequently notice improvements in:
          </p>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={22} className="text-primary-light flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
