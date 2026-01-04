import React from 'react';
import Card from './ui/Card';
import AnimateOnScroll from './ui/AnimateOnScroll';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import RocketIcon from './icons/RocketIcon';
import StrategyIcon from './icons/StrategyIcon';

const features = [
  {
    icon: BrainCircuitIcon,
    title: 'Data-Driven Strategy',
    description: 'We don\'t guess, we analyze. Every decision is backed by data, market research, and predictive analytics to ensure maximum impact.',
  },
  {
    icon: RocketIcon,
    title: 'Measurable ROI',
    description: 'Our focus is on your bottom line. We set clear KPIs and provide transparent reporting to track the tangible return on your investment.',
  },
  {
    icon: StrategyIcon,
    title: 'Custom-Tailored Solutions',
    description: 'Your business is unique. We build bespoke strategies and solutions that are perfectly aligned with your specific goals and audience.',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20" aria-labelledby="why-us-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="why-us-heading" className="text-4xl font-bold mb-4">
            Why Partner With <span className="text-blue-400">Prevaledge?</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            We are more than a marketing agency; we are your strategic partner in growth. Our unique approach ensures your business not only competes, but leads.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <AnimateOnScroll key={feature.title} delay={index * 150}>
            <Card className="text-center h-full">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-full">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;