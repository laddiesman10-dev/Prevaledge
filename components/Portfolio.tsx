import React, { useContext, useRef, useEffect, useMemo } from 'react';
import type { Project } from '../types';
import AnimateOnScroll from './ui/AnimateOnScroll';
import { SiteDataContext } from '../data/siteDataContext';
import Button from './ui/Button';
import { getUnsplashSrcSet } from '../utils/formatContent';

const PortfolioSection: React.FC = () => {
  const { projects } = useContext(SiteDataContext);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const featuredProjects = useMemo(() => {
    return projects.filter(p => p.showOnHomepage);
  }, [projects]);

  useEffect(() => {
    // Ensure imageRefs array is the same size as projects array
    imageRefs.current = imageRefs.current.slice(0, featuredProjects.length);
    
    // Performance: Disable JS-based parallax on mobile devices to improve scrolling.
    if (window.innerWidth < 1024) {
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      imageRefs.current.forEach(img => {
        if (!img) return;
        
        const container = img.parentElement;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();

        // Only apply effect when the card is in the viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollPercent = rect.top / windowHeight;
          const parallaxStrength = 40; // Total pixels of vertical movement
          
          // Map scroll percentage (1 to 0 as it moves up) to a transform range (-20px to 20px)
          const translateY = (0.5 - scrollPercent) * parallaxStrength;

          img.style.willChange = 'transform';
          img.style.transform = `scale(1.1) translateY(${translateY}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to set initial positions
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up inline styles on unmount
      imageRefs.current.forEach(img => {
        if (img) {
          img.style.willChange = '';
          img.style.transform = '';
        }
      });
    };
  }, [featuredProjects]);

  return (
    <>
      <section id="portfolio" className="py-20" aria-labelledby="portfolio-heading">
        <AnimateOnScroll>
          <div className="text-center">
            <h2 id="portfolio-heading" className="text-4xl font-bold mb-4">
              Our <span className="text-blue-400">Work</span>
            </h2>
            <p className="max-w-3xl mx-auto text-slate-400 mb-12">
              We deliver transformative results. Explore a selection of our projects that showcase our commitment to excellence and innovation.
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => {
            const { src, srcSet } = getUnsplashSrcSet(project.image);
            return (
                <AnimateOnScroll key={project.id} delay={index * 100}>
                <Button
                    href={`/project/${project.slug}`}
                    variant="link"
                    className="text-left p-0 w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 group"
                    aria-label={`View case study for project: ${project.title}`}
                >
                    <div className="relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800 transition-all duration-300 group-hover:border-blue-500/50 group-hover:-translate-y-1 h-full">
                    <img
                        ref={el => { imageRefs.current[index] = el }}
                        src={src}
                        srcSet={srcSet}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={`Showcase image for the ${project.title} project`}
                        className="w-full h-56 object-cover"
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-sm text-blue-400 font-semibold">{project.category}</p>
                        <h3 className="text-xl font-bold text-white mt-1">{project.title}</h3>
                    </div>
                    </div>
                </Button>
                </AnimateOnScroll>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default PortfolioSection;