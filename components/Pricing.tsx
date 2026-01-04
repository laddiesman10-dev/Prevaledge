import React, { useState, useRef, useContext } from 'react';
import type { ServicePricing } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import AnimateOnScroll from './ui/AnimateOnScroll';
import CheckIcon from './icons/CheckIcon';
import { SiteDataContext } from '../data/siteDataContext';
import ProjectIcon from './icons/ProjectIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import StrategyIcon from './icons/StrategyIcon';


const PricingSection: React.FC = () => {
  const { servicePricingData } = useContext(SiteDataContext);
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const activeService = servicePricingData[activeTab];
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % servicePricingData.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + servicePricingData.length) % servicePricingData.length;
    }

    if (newIndex !== index) {
      setActiveTab(newIndex);
      tabsRef.current[newIndex]?.focus();
    }
  };

  const isDiscountValid = activeService &&
    activeService.discountPercentage && activeService.discountPercentage > 0 &&
    (!activeService.discountEndDate || new Date(activeService.discountEndDate).setHours(23, 59, 59, 999) >= new Date().getTime());

  return (
    <section id="pricing" className="py-20" aria-labelledby="pricing-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="pricing-heading" className="text-4xl font-bold mb-4">
            Plans & <span className="text-blue-400">Pricing</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            Transparent, flexible pricing for every stage of your business. Find the perfect plan for the service you need.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <AnimateOnScroll delay={200}>
          <div className="relative w-full overflow-hidden mb-12">
            <div className="overflow-x-auto pb-4 -mb-4 horizontal-scrollbar">
              <div role="tablist" aria-label="Service pricing plans" className="flex flex-nowrap justify-start md:justify-center gap-2 pr-4">
                {servicePricingData.map((service, index) => (
                  <button
                    key={service.id}
                    ref={(el) => { tabsRef.current[index] = el; }}
                    id={`tab-${slugify(service.serviceTitle)}`}
                    role="tab"
                    aria-controls={`panel-${slugify(service.serviceTitle)}`}
                    aria-selected={activeTab === index}
                    onClick={() => setActiveTab(index)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0
                      transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-blue-500
                      ${activeTab === index 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70'
                      }
                    `}
                  >
                    <service.icon className="w-5 h-5" />
                    {service.serviceTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Pricing Cards */}
        {activeService && (
          <div 
            key={activeService.id} 
            id={`panel-${slugify(activeService.serviceTitle)}`}
            role="tabpanel"
            aria-labelledby={`tab-${slugify(activeService.serviceTitle)}`}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {activeService.plans.map((plan, index) => {
              const originalPriceString = plan.price;
              let discountedPriceString = '';
              const hasNumericPrice = originalPriceString.toLowerCase() !== 'custom' && !isNaN(parseFloat(originalPriceString.replace(/[^0-9.]/g, '')));

              if (isDiscountValid && hasNumericPrice) {
                const currencySymbol = originalPriceString.match(/^\D+/)?.[0] || '$';
                const originalPrice = parseFloat(originalPriceString.replace(/[^0-9.]/g, ''));
                const discountedPrice = originalPrice * (1 - (activeService.discountPercentage! / 100));
                discountedPriceString = `${currencySymbol}${Math.round(discountedPrice)}`;
              }

              return (
                <AnimateOnScroll key={plan.id} delay={index * 150}>
                  <Card isPopular={plan.isPopular} className="flex flex-col h-full">
                    {plan.isPopular && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
                        Most Popular
                      </div>
                    )}
                    {isDiscountValid && hasNumericPrice && (
                       <div className="absolute top-0 left-6 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
                        {activeService.discountPercentage}% OFF
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-center text-white mb-2">{plan.name}</h3>
                      <div className="text-center my-4 h-12 flex flex-col justify-center">
                        {isDiscountValid && hasNumericPrice ? (
                            <div>
                                <span className="text-2xl font-medium text-slate-500 line-through mr-2">{originalPriceString}</span>
                                <span className="text-4xl font-extrabold">{discountedPriceString}</span>
                            </div>
                        ) : (
                            <p className="text-4xl font-extrabold">{plan.price}</p>
                        )}
                        {plan.priceDetail && <span className="text-lg font-medium text-slate-400">{plan.priceDetail}</span>}
                      </div>

                      <p className="text-slate-400 text-center min-h-[48px] mb-6">{plan.description}</p>
                      
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto">
                      <Button href="#contact" variant={plan.isPopular ? 'primary' : 'secondary'} className="w-full">
                        {plan.name === 'Scale' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </div>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        )}
      </div>

      <AnimateOnScroll delay={300}>
        <div className="mt-24 text-center">
            <h3 className="text-3xl font-bold mb-4">
                Flexible Engagement Models
            </h3>
            <p className="max-w-3xl mx-auto text-slate-400 mb-12">
                Our plans are a starting point. We specialize in creating custom-tailored solutions to meet your unique business goals.
            </p>
        </div>
      </AnimateOnScroll>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimateOnScroll delay={400}>
              <Card className="flex flex-col h-full text-center items-center">
                  <div className="flex justify-center mb-4 p-3 bg-slate-800 border border-slate-700 rounded-full">
                      <ProjectIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Project-Based Pricing</h4>
                  <p className="text-slate-400">
                      For specific, well-defined projects like a website build, a complete SEO audit, or setting up an initial ad campaign, we can provide a fixed, project-based quote. You'll know the total cost upfront with no surprises.
                  </p>
              </Card>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500}>
              <Card className="flex flex-col h-full text-center items-center">
                  <div className="flex justify-center mb-4 p-3 bg-slate-800 border border-slate-700 rounded-full">
                      <ClipboardListIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Custom Retainer Model</h4>
                  <p className="text-slate-400">
                      For ongoing services like Quantum SEO, Performance Marketing, or Social Media Management, we can create a custom monthly retainer. This model provides you with a dedicated team and consistent effort, and we can adjust the scope and budget on a quarterly basis to match your evolving needs.
                  </p>
              </Card>
          </AnimateOnScroll>

          <AnimateOnScroll delay={600}>
              <Card className="flex flex-col h-full text-center items-center">
                   <div className="flex justify-center mb-4 p-3 bg-slate-800 border border-slate-700 rounded-full">
                      <StrategyIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Consulting & Strategy Workshops</h4>
                  <p className="text-slate-400">
                      If you're looking for high-level strategy without a long-term execution commitment, we offer intensive consulting packages. This could be a one-day strategy workshop to build your entire marketing roadmap or a block of consulting hours to advise your internal team.
                  </p>
              </Card>
          </AnimateOnScroll>
      </div>
    </section>
  );
};

export default PricingSection;