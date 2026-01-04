import React, { useState, useRef, useEffect } from 'react';
import InteractiveProcessFlowIcon from './icons/InteractiveProcessFlowIcon';
import AnimateOnScroll from './ui/AnimateOnScroll';
import MapPinIcon from './icons/MapPinIcon';
import PhoneIcon from './icons/PhoneIcon';
import MailIcon from './icons/MailIcon';

type Stage = 'discover' | 'strategize' | 'execute' | 'optimize';

const About: React.FC = () => {
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  
  const processStages = [
    { 
      id: 'discover', 
      title: '01. Discover',
      description: 'We begin by immersing ourselves in your world. Through collaborative workshops, stakeholder interviews, and in-depth market research, we uncover the core challenges and opportunities. We conduct comprehensive audits of your digital presence, competitors, and audience to build a foundational understanding that informs every subsequent decision.'
    },
    { 
      id: 'strategize', 
      title: '02. Strategize',
      description: 'With insights from the discovery phase, we architect a bespoke, data-driven strategy. This is the blueprint for your success. We define clear KPIs, map out customer journeys, and create a comprehensive roadmap that integrates SEO, content, and performance marketing into a cohesive, goal-oriented plan.'
    },
    { 
      id: 'execute', 
      title: '03. Execute',
      description: 'This is where strategy becomes reality. Our team of developers, designers, and marketers bring the plan to life with precision and creativity. Whether it\'s building a high-performance headless website, launching targeted ad campaigns, or creating authoritative content, we execute with an agile methodology, ensuring quality and momentum.'
    },
    { 
      id: 'optimize', 
      title: '04. Optimize',
      description: 'Launch is just the beginning. We continuously monitor performance against your KPIs, using advanced analytics to gather actionable insights. Through A/B testing, data analysis, and iterative refinement, we optimize every facet of the strategy to maximize your return on investment and drive sustainable, long-term growth.'
    },
  ];

  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger in the middle of the viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveStage(entry.target.id as Stage);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRefs = stageRefs.current;
    
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section id="about" className="py-20 overflow-hidden" aria-labelledby="about-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="about-heading" className="text-4xl font-bold mb-4">
            Our Proven <span className="text-blue-400">Process</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-16">
            We are architects of digital transformation, your strategic partner in navigating the complexities of the modern digital landscape. Our four-stage process ensures clarity, precision, and results.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="lg:sticky top-24">
          <AnimateOnScroll>
            <InteractiveProcessFlowIcon activeStage={activeStage} className="w-full max-w-lg mx-auto h-auto" />
          </AnimateOnScroll>
        </div>
        
        <div className="space-y-32">
          {processStages.map((stage, index) => (
            <div 
              key={stage.id} 
              id={stage.id} 
              ref={el => { stageRefs.current[index] = el }}
              className="min-h-[150px]"
            >
                <h3 className="text-3xl font-bold text-blue-400 mb-4">{stage.title}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimateOnScroll delay={400}>
        <div className="mt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <div className="flex flex-col items-center">
            <MapPinIcon className="w-8 h-8 text-blue-400 mb-3" aria-hidden="true" />
            <h4 className="font-semibold text-white">Our Office</h4>
            <p className="text-sm text-slate-400">C 1 To 26 Vardhman Grandeur, Andheri West Mumbai, India 400058</p>
          </div>
          <div className="flex flex-col items-center">
            <PhoneIcon className="w-8 h-8 text-blue-400 mb-3" aria-hidden="true" />
            <h4 className="font-semibold text-white">Call Us</h4>
            <p className="text-sm text-slate-400">+91 9455573671</p>
          </div>
          <div className="flex flex-col items-center">
            <MailIcon className="w-8 h-8 text-blue-400 mb-3" aria-hidden="true" />
            <h4 className="font-semibold text-white">Email Us</h4>
            <p className="text-sm text-slate-400">info@prevaledge.com</p>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default About;