interface ApproachData {
  sectionTitle: string;
  description?: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

interface ConditionApproachProps {
  data: ApproachData;
}

export default function ConditionApproach({ data }: ConditionApproachProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {data.sectionTitle}
        </h2>
        {data.description && (
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
            {data.description}
          </p>
        )}
        <div className="max-w-4xl mx-auto space-y-6">
          {data.steps.map((step, index) => (
            <div key={index} className="flex gap-6 p-6 bg-white rounded-xl">
              <div className="flex-shrink-0">
                <div className="bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
