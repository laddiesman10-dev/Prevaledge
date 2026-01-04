
import React, { useContext } from 'react';
import Button from './ui/Button';
import { SiteDataContext } from '../data/siteDataContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { socialLinks } = useContext(SiteDataContext);

  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div className="md:col-span-2">
            <h3 className="font-bold text-white text-lg mb-2">Prevaledge</h3>
            <p className="text-slate-400 max-w-sm mx-auto md:mx-0">Pioneering the digital frontier of today, we build the future of your brand with data-driven strategies and AI-powered solutions.</p>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-2">Featured</h3>
            <ul className="space-y-2">
              <li><Button href="/ai-toolkit" variant="link" className="!text-slate-400">Free AI Toolkit</Button></li>
              <li><Button href="/blog" variant="link" className="!text-slate-400">Our Blog</Button></li>
              <li><Button href="#pricing" variant="link" className="!text-slate-400">View Pricing</Button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-2">Company</h3>
            <ul className="space-y-2">
              <li><Button href="#about" variant="link" className="!text-slate-400">Our Process</Button></li>
              <li><Button href="/careers" variant="link" className="!text-slate-400">Careers</Button></li>
              <li><Button href="#contact" variant="link" className="!text-slate-400">Contact Us</Button></li>
              <li><Button href="/login" variant="link" className="!text-slate-400">Client Portal</Button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex justify-center items-center gap-6 mb-6">
              {socialLinks.map((link) => {
                  const Icon = link.icon;
                  if (!Icon) return null;
                  return (
                      <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${link.name}`}
                          className="text-slate-400 hover:text-blue-400 transition-colors duration-300"
                      >
                          <Icon className="w-6 h-6" />
                      </a>
                  );
              })}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm">
              <p>&copy; {currentYear} Prevaledge. All rights reserved.</p>
              <Button href="/privacy-policy" variant="link">
                  Privacy Policy
              </Button>
              <span className="hidden sm:inline">|</span>
              <Button href="/terms-and-conditions" variant="link">
                  Terms & Conditions
              </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
