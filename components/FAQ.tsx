import React, { useState } from 'react';
import AnimateOnScroll from './ui/AnimateOnScroll';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import { initialFaqData as faqData } from '../data/siteData';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-6"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-white">{question}</span>
        {isOpen ? <MinusIcon className="w-6 h-6 text-blue-400 flex-shrink-0" /> : <PlusIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen pb-6' : 'max-h-0'}`}
      >
        <p className="text-slate-300 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20" aria-labelledby="faq-heading">
      <AnimateOnScroll>
        <div className="text-center">
          <h2 id="faq-heading" className="text-4xl font-bold mb-4">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-400 mb-12">
            Have questions? We have answers. Here are some of the most common inquiries we receive from potential partners.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={200}>
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default FAQSection;