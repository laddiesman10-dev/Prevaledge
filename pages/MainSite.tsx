import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServicesSection from '../components/Services';
import PortfolioSection from '../components/Portfolio';
import TeamSection from '../components/Team';
import TestimonialsSection from '../components/Testimonials';
import PricingSection from '../components/Pricing';
import BlogSection from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import NewsTicker from '../components/NewsTicker';
import About from '../components/About';
import AIToolkit from '../components/AIToolkit';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import LeadMagnet from '../components/LeadMagnet';
import SocialProofToaster from '../components/SocialProofToaster';
import ExitIntentPopup from '../components/ExitIntentPopup';
import WhyChooseUs from '../components/WhyChooseUs';
import AIToolkitPromo from '../components/AIToolkitPromo';
import DeferredRenderer from '../components/DeferredRenderer';
import FAQSection from '../components/FAQ';
import LiveChatWidget from '../components/LiveChatWidget';
import TrustBadges from '../components/TrustBadges';

interface MainSiteProps {
  route: string;
}

const MainSite: React.FC<MainSiteProps> = ({ route }) => {
  useScrollOnRouteChange(route);
  
  return (
    <div className="text-white font-sans">
      <Header />
      
      <main className="relative z-10 animate-content-fade-in">
        <div id="top" className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
        </div>

        <NewsTicker />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ServicesSection />
            <PortfolioSection />
            <WhyChooseUs />
            <AIToolkitPromo />
            <TestimonialsSection />
            <About />
            <AIToolkit />
            <LeadMagnet />
            <BlogSection />
            <PricingSection />
            <TeamSection />
            <FAQSection />
            <Contact />
        </div>
      </main>
      
      <Footer />
      <TrustBadges />
      
      <LiveChatWidget />

      <DeferredRenderer delay={3500}>
        <SocialProofToaster />
        <ExitIntentPopup />
      </DeferredRenderer>
    </div>
  );
};

export default MainSite;
