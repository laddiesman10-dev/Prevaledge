import React, { useContext, useState, useMemo, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { SiteDataContext } from '../data/siteDataContext';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import SearchIcon from '../components/icons/SearchIcon';
import { inputClass } from '../components/admin/ui/formStyles';
import ProjectDashboard from '../components/client/ProjectDashboard';
import ClientDocumentsView from '../components/client/ClientDocumentsView';
import { RouterContext, ArchivedDocument } from '../types';
import { useClientAuth } from '../context/ClientAuthContext';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon';
import Button from '../components/ui/Button';
import LogoutIcon from '../components/icons/LogoutIcon';
import ProjectIcon from '../components/icons/ProjectIcon';
import ArchiveIcon from '../components/icons/ArchiveIcon';

const ClientPortalPage: React.FC = () => {
  const { currentClient, logout } = useClientAuth();
  const { navigate } = useContext(RouterContext);
  const { projects, tasks, documentHistory } = useContext(SiteDataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'documents'>('projects');

  useEffect(() => {
    if (!currentClient) {
      navigate('/login');
    }
  }, [currentClient, navigate]);
  
  useScrollOnRouteChange('/portal');
  
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const clientProjects = useMemo(() => {
      if (!currentClient) return [];
      return projects.filter(p => p.clientId === currentClient.id);
  }, [projects, currentClient]);

  const clientProjectSlugs = useMemo(() => clientProjects.map(p => p.slug), [clientProjects]);

  const clientTasks = useMemo(() => {
      if (!currentClient) return [];
      return tasks.filter(t => t.relatedProject && clientProjectSlugs.includes(t.relatedProject));
  }, [tasks, clientProjectSlugs, currentClient]);

  const clientDocuments = useMemo(() => {
      if (!currentClient) return [];
      return documentHistory.filter(d => d.clientId === currentClient.id)
                            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());
  }, [documentHistory, currentClient]);

  const projectsWithOverdueTasks = useMemo(() => {
      const overdueSlugs = new Set();
      const now = new Date();
      clientTasks.forEach(task => {
          if (task.status !== 'Done' && new Date(task.dueDate) < now) {
              overdueSlugs.add(task.relatedProject);
          }
      });
      return overdueSlugs;
  }, [clientTasks]);


  const filteredProjects = useMemo(() => {
    if (activeTab !== 'projects' || !searchTerm.trim()) {
      return clientProjects;
    }
    const lowerSearch = searchTerm.toLowerCase();
    
    const matchingTaskProjectSlugs = new Set(clientTasks
        .filter(task => task.title.toLowerCase().includes(lowerSearch) || (task.description && task.description.toLowerCase().includes(lowerSearch)))
        .map(t => t.relatedProject)
    );

    return clientProjects.filter(project =>
      project.title.toLowerCase().includes(lowerSearch) ||
      matchingTaskProjectSlugs.has(project.slug)
    );
  }, [searchTerm, clientProjects, clientTasks, activeTab]);
  
  const filteredDocuments = useMemo(() => {
    if (activeTab !== 'documents' || !searchTerm.trim()) {
      return clientDocuments;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return clientDocuments.filter(doc => 
        doc.documentNumber.toLowerCase().includes(lowerSearch) ||
        doc.lineItems.some(item => item.description.toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm, clientDocuments, activeTab]);

  if (!currentClient) {
    return <div className="fixed inset-0 bg-slate-950 z-50" />;
  }
  
  const searchPlaceholder = activeTab === 'projects' ? `Search ${currentClient.company}'s projects...` : "Search by document # or item...";

  return (
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in min-h-screen">
      <ParticleBackground />
      
       <header className="fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <BrainCircuitIcon className="w-8 h-8 text-blue-400" />
                    <span>Prevaledge</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300 hidden sm:block">
                        Welcome, <span className="font-semibold text-white">{currentClient.company}</span>
                    </span>
                    <Button onClick={logout} variant="secondary" className="!px-3 !py-2">
                        <LogoutIcon className="w-5 h-5" />
                        <span className="ml-2 hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </div>
      </header>
      
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <p className="text-lg font-semibold text-blue-400">Client Portal</p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">Welcome, {currentClient.company}</h1>
            </header>
            
            <section className="mb-8 space-y-6">
                <div className="border-b border-slate-800">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('projects')}
                            className={`${activeTab === 'projects' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}
                            flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            <ProjectIcon className="w-5 h-5" /> Projects
                        </button>
                         <button onClick={() => setActiveTab('documents')}
                            className={`${activeTab === 'documents' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}
                            flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            <ArchiveIcon className="w-5 h-5" /> Billing & Documents
                        </button>
                    </nav>
                </div>
                <div className="relative max-w-lg mx-auto">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholder}
                        className={`${inputClass} !pl-11`}
                        aria-label="Search"
                    />
                </div>
            </section>

            {activeTab === 'projects' && (
                <div className="space-y-12">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => {
                    const projectTasks = clientTasks.filter(t => t.relatedProject === project.slug);
                    return (
                        <ProjectDashboard
                        key={project.id}
                        project={project}
                        tasks={projectTasks}
                        hasOverdueTasks={projectsWithOverdueTasks.has(project.slug)}
                        />
                    );
                    })
                ) : searchTerm ? (
                    <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <p className="text-xl font-semibold text-slate-300">No Results Found</p>
                        <p className="text-slate-500 mt-2">Your search for "{searchTerm}" did not match any projects or tasks.</p>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <p className="text-xl font-semibold text-slate-300">No Projects Found</p>
                        <p className="text-slate-500 mt-2">There are currently no projects assigned to your portal.</p>
                    </div>
                )}
                </div>
            )}
            
            {activeTab === 'documents' && (
                <ClientDocumentsView documents={filteredDocuments} searchTerm={searchTerm}/>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientPortalPage;