import { Link } from 'react-router-dom';
import { Baby, Heart, Users, ArrowRight } from 'lucide-react';
import { services } from '../data/services';
import AnimateOnScroll from './AnimateOnScroll';

const iconMap = {
  baby: Baby,
  heart: Heart,
  users: Users,
};

export default function ServicesGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized chiropractic care tailored to your family's unique needs
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <AnimateOnScroll key={service.id} delay={index * 150}>
                <Link
                  to={service.slug}
                  className="bg-white rounded-xl hover:shadow-lg transition group overflow-hidden flex flex-col h-full"
                >
                  {'image' in service && (
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-left">{service.description}</p>
                    <span className="inline-flex items-center gap-2 text-primary-dark font-medium group-hover:gap-3 transition-all">
                      {service.title} <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
