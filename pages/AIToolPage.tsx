import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import type { AITool, RouterContextType } from '../types';
import { RouterContext } from '../types';
import { aiTools } from '../data/siteData';
import Button from '../components/ui/Button';
import TrustBadges from '../components/TrustBadges';

const AIToolPage: React.FC = () => {
  const { route } = useContext(RouterContext);
  const toolId = route.split('/ai-toolkit/')[1];
  const tool = aiTools.find(t => t.id === toolId);
  
  useScrollOnRouteChange(route);

  if (!tool) {
    return (
       <div className="bg-slate-950 text-white min-h-screen">
            <Header />
            <main className="pt-24 text-center">
              <h1 className="text-2xl font-bold">AI Tool Not Found.</h1>
              <p className="text-slate-400 mt-4">The tool you are looking for does not exist.</p>
              <Button href="/ai-toolkit" className="mt-8">Back to AI Toolkit</Button>
            </main>
            <Footer />
        </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ToolComponent />
        </div>
      </main>
      <Footer />
      <TrustBadges />
    </div>
  );
};

export default AIToolPage;
