import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { proseStyles } from '../styles/proseStyles';
import AnimatedMetric from '../components/ui/AnimatedMetric';
import Button from '../components/ui/Button';
import { Project, RouterContext } from '../types';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import { SiteDataContext } from '../data/siteDataContext';
import { getUnsplashSrcSet } from '../utils/formatContent';
import TrustBadges from '../components/TrustBadges';

const CaseStudyPage: React.FC = () => {
  const { route } = useContext(RouterContext);
  const { projects } = useContext(SiteDataContext);

  const slug = route.split('/project/')[1];
  const project = projects.find(p => p.slug === slug);

  useScrollOnRouteChange(route);

  if (!project) {
    return (
        <div className="bg-slate-950 text-white min-h-screen">
            <Header />
            <main className="pt-24 text-center">
              <h1 className="text-2xl font-bold">Project not found.</h1>
              <p className="text-slate-400 mt-4">The project you are looking for does not exist.</p>
              <Button href="/#portfolio" className="mt-8">Back to Portfolio</Button>
            </main>
            <Footer />
        </div>
    );
  }
  
  const { caseStudy } = project;
  const { src, srcSet } = getUnsplashSrcSet(project.image);

  return (
    <>
    <style>{proseStyles}</style>
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
              <p className="text-lg font-semibold text-blue-400">{project.category}</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-2">{project.title}</h1>
            </div>
            
            <img 
                src={src}
                srcSet={srcSet}
                sizes="(max-width: 1024px) 100vw, 1024px"
                alt={`Hero image for the ${project.title} case study`} 
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-2xl mb-12" 
                width="1470"
                height="735"
                fetchPriority="high"
                decoding="async"
            />

            {caseStudy.keyMetrics && caseStudy.keyMetrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center my-16 p-8 bg-slate-900/50 border border-slate-800 rounded-lg">
                    {caseStudy.keyMetrics.map(metric => (
                        <AnimatedMetric key={metric.label} value={metric.value} label={metric.label} />
                    ))}
                </div>
            )}

            <article className="prose-custom leading-relaxed space-y-4">
              <section>
                <h2 className="text-2xl text-blue-400 !mb-3 !mt-8">The Challenge</h2>
                <p>{caseStudy.challenge}</p>
              </section>
               <section>
                <h2 className="text-2xl text-blue-400 !mb-3 !mt-8">Our Solution</h2>
                <p>{caseStudy.solution}</p>
              </section>
               <section>
                <h2 className="text-2xl text-blue-400 !mb-3 !mt-8">The Results</h2>
                <p>{caseStudy.results}</p>
              </section>
            </article>

            <div className="mt-16 text-center space-x-4">
                <Button href="/#portfolio">Back to Portfolio</Button>
                {project.url && (
                    <Button href={project.url} variant="primary">
                        Visit The Live Site
                    </Button>
                )}
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
      <TrustBadges />
    </div>
    </>
  );
};

export default CaseStudyPage;
