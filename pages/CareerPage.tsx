import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import { initialPerks } from '../data/siteData';
import { JobOpening, RouterContext } from '../types';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SiteDataContext } from '../data/siteDataContext';
import TrustBadges from '../components/TrustBadges';

const JobListing: React.FC<{ job: JobOpening }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = `job-title-${job.id}`;
  const { navigate } = useContext(RouterContext);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg transition-all duration-300 hover:border-blue-500/50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6"
        aria-expanded={isOpen}
        aria-controls={`job-details-${job.id}`}
        aria-labelledby={titleId}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <h3 id={titleId} className="font-bold text-xl text-white">{job.title}</h3>
            <p className="text-slate-400 text-sm mt-1">{job.description}</p>
          </div>
          <div className="text-left md:text-center">
            <span className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{job.location}</span>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-sm bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full">{job.type}</span>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div id={`job-details-${job.id}`} className="p-6 border-t border-slate-800 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg text-blue-400 mb-3">Responsibilities</h4>
              <ul className="space-y-2 text-slate-300 list-disc list-inside">
                {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-blue-400 mb-3">Qualifications</h4>
              <ul className="space-y-2 text-slate-300 list-disc list-inside">
                {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button onClick={() => navigate(`/careers/${job.id}`)}>Apply Now</Button>
          </div>
        </div>
      )}
    </div>
  );
}

const CareerPage: React.FC = () => {
  useScrollOnRouteChange('/careers');
  const { jobOpenings } = useContext(SiteDataContext);

  return (
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
                Build the Future <span className="text-blue-400">With Us</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                At Prevaledge, we're a team of innovators, strategists, and creators. We're looking for passionate individuals who want to redefine the boundaries of digital marketing.
              </p>
            </div>
          </AnimateOnScroll>

          <section id="open-positions" className="py-16">
            <AnimateOnScroll>
              <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
            </AnimateOnScroll>
            <div className="max-w-4xl mx-auto space-y-4">
              {jobOpenings.length > 0 ? (
                jobOpenings.map((job, index) => (
                  <AnimateOnScroll key={job.id} delay={index * 100}>
                    <JobListing job={job} />
                  </AnimateOnScroll>
                ))
              ) : (
                <AnimateOnScroll>
                  <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-lg">
                    <p className="text-lg text-slate-400">There are currently no open positions. Please check back later!</p>
                  </div>
                </AnimateOnScroll>
              )}
            </div>
          </section>

          <section id="perks" className="py-16">
            <AnimateOnScroll>
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Perks & <span className="text-blue-400">Benefits</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-slate-400 mb-12">
                        We invest in our team's success and well-being with a comprehensive benefits package designed to support a healthy and fulfilling life.
                    </p>
                </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialPerks.map((perk, index) => (
                    <AnimateOnScroll key={perk.title} delay={index * 100}>
                        <Card className="text-center h-full">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-slate-800 border border-slate-700 rounded-full">
                                    <perk.icon className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{perk.title}</h3>
                            <p className="text-slate-400">{perk.description}</p>
                        </Card>
                    </AnimateOnScroll>
                ))}
            </div>
          </section>
          
          <AnimateOnScroll>
            <div className="mt-16 text-center bg-slate-900/50 border border-slate-800 rounded-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white">Don't See Your Role?</h3>
              <p className="text-slate-400 mt-2 mb-6">We're always looking for talented people. If you believe you'd be a great fit for our team, send us your resume and a note about why you're passionate about working at Prevaledge.</p>
              <Button href="mailto:careers@prevaledge.com?subject=Speculative Application">Get in Touch</Button>
            </div>
          </AnimateOnScroll>

        </div>
      </main>
      
      <Footer />
      <TrustBadges />
    </div>
  );
};

export default CareerPage;
