
import React, { useContext, useState } from 'react';
import type { Service } from '../types';
import Card from './ui/Card';
import AnimateOnScroll from './ui/AnimateOnScroll';
import { SiteDataContext } from '../data/siteDataContext';
import ServiceModal from './ServiceModal';

const ServicesSection: React.FC = () => {
  const { services } = useContext(SiteDataContext);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <>
      <section id="services" className="py-20" aria-labelledby="services-heading">
        <AnimateOnScroll>
          <h2 id="services-heading" className="text-4xl font-bold text-center mb-12">
            Our <span className="text-blue-400">Services</span>
          </h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <AnimateOnScroll key={service.id} delay={index * 100}>
              <button 
                onClick={() => handleOpenModal(service)}
                className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl group"
                aria-label={`Learn more about ${service.title}`}
              >
                <Card>
                  <div className="flex justify-center mb-4">
                    <service.icon 
                      aria-hidden="true"
                      className="
                        w-12 h-12 text-blue-400 
                        transition-all duration-500 ease-out 
                        group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
                      "
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-center">{service.description}</p>
                </Card>
              </button>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      <ServiceModal service={selectedService} onClose={handleCloseModal} />
    </>
  );
};

export default ServicesSection;