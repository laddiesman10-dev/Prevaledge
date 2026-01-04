import React from 'react';
import Button from './ui/Button';

const Hero: React.FC = () => {
  const line1 = "Driving Growth in the".split(" ");
  const line2 = "Digital Age";

  return (
    <section className="min-h-[90vh] md:min-h-[80vh] flex items-center justify-center text-center py-20 relative">
      <div className="z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-tight tracking-tighter">
          <span>
            {line1.map((word, index) => (
              <span 
                key={index} 
                className="inline-block animate-fade-in-up-word" 
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {word}&nbsp;
              </span>
            ))}
          </span>
          <br />
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 inline-block animate-fade-in-up-word"
            style={{ animationDelay: `${line1.length * 120}ms` }}
          >
            {line2}
          </span>
        </h1>
        <p 
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 animate-fade-in-up-word"
          style={{ animationDelay: `${(line1.length + 1) * 120}ms` }}
        >
          At Prevaledge, we build the future of your brand. We are architects of digital transformation, providing cutting-edge solutions for today's competitive landscape.
        </p>
        <div 
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up-word"
          style={{ animationDelay: `${(line1.length + 2) * 120}ms` }}
        >
          <Button href="/ai-toolkit" className="w-full sm:w-auto">
            Explore Free AI Tools
          </Button>
          <Button href="#portfolio" variant="secondary" className="w-full sm:w-auto">Explore Our Work</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;