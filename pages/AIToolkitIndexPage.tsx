import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import AIToolkit from '../components/AIToolkit';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import TrustBadges from '../components/TrustBadges';

const AIToolkitIndexPage: React.FC = () => {
  useScrollOnRouteChange('/ai-toolkit');

  return (
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
              The Prevaledge <span className="text-blue-400">AI Toolkit</span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-400">
              Welcome to your new digital strategy command center. Below is a suite of powerful, free-to-use AI tools designed to give you a competitive edge. From drafting content to analyzing competitors, these utilities are here to help you execute with precision.
            </p>
          </div>
          <AIToolkit />
        </div>
      </main>
      <Footer />
      <TrustBadges />
    </div>
  );
};

export default AIToolkitIndexPage;
