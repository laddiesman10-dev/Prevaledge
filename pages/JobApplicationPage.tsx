import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import { SiteDataContext } from '../data/siteDataContext';
import { RouterContext } from '../types';
import Button from '../components/ui/Button';
import ApplicationForm from '../components/ApplicationForm';
import { proseStyles } from '../styles/proseStyles';
import TrustBadges from '../components/TrustBadges';

const JobApplicationPage: React.FC = () => {
  const { route } = useContext(RouterContext);
  const { jobOpenings } = useContext(SiteDataContext);

  const jobId = route.split('/careers/')[1];
  const job = jobOpenings.find(j => j.id === jobId);

  useScrollOnRouteChange(route);

  if (!job) {
    return (
      <div className="bg-slate-950 text-white min-h-screen">
        <Header />
        <main className="pt-24 text-center container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold">Job Opening Not Found</h1>
          <p className="text-slate-400 mt-4">The position you are looking for does not exist or is no longer available.</p>
          <Button href="/careers" className="mt-8">Back to Careers</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{proseStyles}</style>
      <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
        <ParticleBackground />
        <Header />
        
        <main id="top" className="relative z-10 pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <article className="max-w-4xl mx-auto">
              <header className="text-center mb-12">
                <p className="text-lg font-semibold text-blue-400">{job.type} &middot; {job.location}</p>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mt-2">{job.title}</h1>
                <p className="text-slate-400 mt-4">
                  Posted on {new Date(job.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </header>

              <div className="prose-custom leading-relaxed bg-slate-900/50 border border-slate-800 rounded-lg p-6 md:p-10">
                <p className="lead text-xl !text-slate-300">{job.description}</p>
                
                <h2 className="text-2xl text-blue-400 !mb-3 !mt-8">Responsibilities</h2>
                <ul>
                  {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                
                <h2 className="text-2xl text-blue-400 !mb-3 !mt-8">Qualifications</h2>
                <ul>
                  {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              
              <section id="apply" className="mt-16">
                  <ApplicationForm job={job} />
              </section>

            </article>
          </div>
        </main>
        
        <Footer />
        <TrustBadges />
      </div>
    </>
  );
};

export default JobApplicationPage;
