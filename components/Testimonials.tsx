
import React, { useState, useEffect, useContext } from 'react';
import type { Testimonial } from '../types';
import Card from './ui/Card';
import AnimateOnScroll from './ui/AnimateOnScroll';
import QuoteIcon from './icons/QuoteIcon';
import { SiteDataContext } from '../data/siteDataContext';

const TestimonialsSection: React.FC = () => {
  const { testimonials } = useContext(SiteDataContext);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-20" aria-labelledby="testimonials-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="testimonials-heading" className="text-4xl font-bold mb-4">
            What Our <span className="text-blue-400">Partners</span> Say
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            We're proud to have partnered with innovative companies to achieve exceptional results.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll>
        <div className="max-w-3xl mx-auto relative min-h-[300px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                activeIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={activeIndex !== index}
            >
              <Card className="h-full">
                <div className="relative h-full flex flex-col justify-center">
                  <QuoteIcon className="absolute top-4 left-4 w-12 h-12 text-slate-700/50" aria-hidden="true" />
                  <blockquote className="text-lg md:text-xl text-slate-200 leading-relaxed mb-6 z-10">
                    "{testimonial.quote}"
                  </blockquote>
                  <footer className="text-right z-10">
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </footer>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default TestimonialsSection;