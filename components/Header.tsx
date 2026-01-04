
import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import SearchIcon from './icons/SearchIcon';
import SearchOverlay from './SearchOverlay';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true); // Controls visibility based on scroll direction
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const customNavigate = useCustomNavigate();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic for background style
      setIsScrolled(currentScrollY > 10);

      // Logic for showing/hiding header
      // Hide header on scroll down past a certain threshold
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) { 
        setShowHeader(false);
      } else { // Show header on scroll up or when near the top
        setShowHeader(true);
      }
      
      // Update last scroll position for the next event
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
      e.preventDefault();
      customNavigate(href);
      setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Our Work' },
    { href: '#about', label: 'Process' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '/ai-toolkit', label: 'AI Toolkit' },
    { href: '/blog', label: 'Blog' },
  ];
  
  // The header should always be visible if the mobile menu is open.
  const isHeaderVisible = showHeader || isMobileMenuOpen;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 transform
          ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled || isMobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'}`
        }
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={(e) => handleNavClick(e, '/site')} className="flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-80">
              <BrainCircuitIcon className="w-8 h-8 text-blue-400" />
              <span>Prevaledge</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                  <Button key={link.href} onClick={(e) => handleNavClick(e, link.href)} variant="link">
                    {link.label}
                  </Button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Open search"
              >
                <SearchIcon className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <Button onClick={(e) => handleNavClick(e, '#contact')}>
                  Contact Us
                </Button>
              </div>
              {/* Hamburger Menu Button */}
              <div className="lg:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 text-slate-400 hover:text-blue-400 transition-colors"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                  >
                    {isMobileMenuOpen ? (
                      <XIcon className="w-6 h-6" />
                    ) : (
                      <MenuIcon className="w-6 h-6" />
                    )}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-20 bg-slate-950/95 backdrop-blur-lg lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28">
            <nav className="flex flex-col items-center gap-8">
                {navLinks.map((link, index) => (
                    <div 
                        key={link.href}
                        className="transition-all duration-300"
                        style={{ 
                            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(15px)',
                            opacity: isMobileMenuOpen ? 1 : 0,
                            transitionDelay: `${index * 50}ms`,
                            transitionProperty: 'transform, opacity'
                        }}
                    >
                        <Button
                            onClick={(e) => handleNavClick(e, link.href)}
                            variant="link"
                            className="text-2xl !font-semibold text-slate-200 hover:text-blue-300"
                        >
                            {link.label}
                        </Button>
                    </div>
                ))}
                <div 
                    className="mt-6 transition-all duration-300"
                    style={{ 
                        transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(15px)',
                        opacity: isMobileMenuOpen ? 1 : 0,
                        transitionDelay: `${navLinks.length * 50}ms`,
                        transitionProperty: 'transform, opacity'
                    }}
                >
                    <Button onClick={(e) => handleNavClick(e, '#contact')}>
                        Contact Us
                    </Button>
                </div>
            </nav>
        </div>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default React.memo(Header);
