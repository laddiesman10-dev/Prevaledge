import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SiteDataProvider } from './data/siteDataContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ClientAuthProvider } from './context/ClientAuthContext';
import { RouterContext } from './types';
import SeoManager from './components/SeoManager';
import ParticleBackground from './components/ParticleBackground';

// Lazy load pages for better performance
const MainSite = lazy(() => import('./pages/MainSite'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const AIToolPage = lazy(() => import('./pages/AIToolPage'));
const AIToolkitIndexPage = lazy(() => import('./pages/AIToolkitIndexPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CareerPage = lazy(() => import('./pages/CareerPage'));
const JobApplicationPage = lazy(() => import('./pages/JobApplicationPage'));
const ClientLoginPage = lazy(() => import('./pages/ClientLoginPage'));
const ClientPortalPage = lazy(() => import('./pages/ClientPortalPage'));
const PublicInvoicePage = lazy(() => import('./pages/PublicInvoicePage'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const Robots = lazy(() => import('./pages/Robots'));

const LoadingFallback: React.FC = () => {
    // The preloader in index.html handles the initial loading visual.
    // Returning null here prevents a layout flash while suspense loads.
    return null; 
}

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
      }, 500);
    }
  }, []);

  const renderRoute = () => {
    if (route === '/' || route === '/site' || route.startsWith('/#')) return <MainSite route={route} />;
    if (route.startsWith('/project/')) return <CaseStudyPage />;
    if (route.startsWith('/blog/')) return <BlogPage />;
    if (route === '/blog') return <BlogIndexPage />;
    if (route.startsWith('/ai-toolkit/')) return <AIToolPage />;
    if (route === '/ai-toolkit') return <AIToolkitIndexPage />;
    if (route === '/careers') return <CareerPage />;
    if (route.startsWith('/careers/')) return <JobApplicationPage />;
    if (route === '/privacy-policy') return <PrivacyPolicy />;
    if (route === '/terms-and-conditions') return <TermsAndConditions />;
    if (route === '/admin') return <AdminPanel />;
    if (route === '/login') return <ClientLoginPage />;
    if (route.startsWith('/portal/')) {
        // The ClientAuthProvider will redirect to login if not authenticated
        return <ClientPortalPage />;
    }
    if (route.startsWith('/invoice/')) return <PublicInvoicePage />;

    // Special routes for sitemap/robots.txt
    if (route === '/sitemap.xml') return <Sitemap />;
    if (route === '/robots.txt') return <Robots />;

    // Fallback to MainSite for unknown routes
    return <MainSite route={route} />;
  };

  const routerContextValue = { route, navigate };

  return (
    <RouterContext.Provider value={routerContextValue}>
      <SiteDataProvider>
        <AuthProvider>
          <ClientAuthProvider>
            <ErrorBoundary>
              <div className="relative z-0">
                <ParticleBackground />
                <SeoManager />
                <Suspense fallback={<LoadingFallback />}>
                  {renderRoute()}
                </Suspense>
              </div>
            </ErrorBoundary>
          </ClientAuthProvider>
        </AuthProvider>
      </SiteDataProvider>
    </RouterContext.Provider>
  );
};

export default App;