import React, { useContext } from 'react';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import DashboardIcon from '../icons/DashboardIcon';
import AgentIcon from '../icons/AgentIcon';
import LogoutIcon from '../icons/LogoutIcon';
import ProjectIcon from '../icons/ProjectIcon';
import UsersIcon from '../icons/UsersIcon';
import MessageSquareIcon from '../icons/MessageSquareIcon';
import BarChartIcon from '../icons/BarChartIcon';
import PriceTagIcon from '../icons/PriceTagIcon';
import FileTextIcon from '../icons/FileTextIcon';
import ClipboardCopyIcon from '../icons/ClipboardCopyIcon';
import ArchiveIcon from '../icons/ArchiveIcon';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import { RouterContext, AdminView, User, Permission } from '../../types';
import { SiteDataContext } from '../../data/siteDataContext';
import LinkIcon from '../icons/LinkIcon';
import RadarIcon from '../icons/RadarIcon';
import GraduationCapIcon from '../icons/GraduationCapIcon';
import ClipboardSearchIcon from '../icons/ClipboardSearchIcon';

interface AdminSidebarProps {
  currentUser: User;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  hasPermission: (permission: Permission) => boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentUser, activeView, setActiveView, onLogout, isSidebarOpen, setIsSidebarOpen, hasPermission }) => {
    
    const { navigate } = useContext(RouterContext);
    const { hasNewSubmission, clearNewSubmission } = useContext(SiteDataContext);
    
    const handleNavClick = (view: AdminView) => {
        setActiveView(view);
        setIsSidebarOpen(false);
        if (view === 'analytics') {
            clearNewSubmission();
        }
    }

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
      ]
    },
    {
      title: 'AI & Strategy',
      items: [
        { id: 'strategist', label: 'The Strategist', icon: BrainCircuitIcon },
        { id: 'horizonScanner', label: 'Horizon Scanner', icon: RadarIcon },
        { id: 'leadGenNurture', label: 'Lead Gen & Nurture', icon: ClipboardSearchIcon },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'tasks', label: 'Task Management', icon: ClipboardListIcon },
        { id: 'clients', label: 'Client Management', icon: BriefcaseIcon },
        { id: 'invoicing', label: 'Invoice Generator', icon: FileTextIcon },
        { id: 'quotations', label: 'Quote Generator', icon: ClipboardCopyIcon },
        { id: 'documentHistory', label: 'Document History', icon: ArchiveIcon },
      ]
    },
    {
      title: 'Content & Site',
      items: [
        { id: 'blog', label: 'Manage Blog', icon: FileTextIcon },
        { id: 'projects', label: 'Manage Projects', icon: ProjectIcon },
        { id: 'services', label: 'Manage Services', icon: AgentIcon },
        { id: 'pricing', label: 'Manage Pricing', icon: PriceTagIcon },
        { id: 'testimonials', label: 'Manage Testimonials', icon: MessageSquareIcon },
        { id: 'socials', label: 'Manage Socials', icon: LinkIcon },
        { id: 'careers', label: 'Manage Careers', icon: GraduationCapIcon },
        { id: 'jobApplications', label: 'Job Applications', icon: UsersIcon },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'users', label: 'Users & Permissions', icon: UsersIcon },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <a href="/site" onClick={(e) => { e.preventDefault(); navigate('/site'); }} className="flex items-center gap-2 text-xl font-bold transition-colors duration-300 text-slate-100 hover:text-blue-400">
          <BrainCircuitIcon className="w-8 h-8 text-blue-400" />
          <span>Prevaledge</span>
        </a>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navGroups.map(group => {
            const visibleItems = group.items.filter(item => hasPermission(item.id as Permission));
            
            if (visibleItems.length === 0) {
                return null;
            }

            return (
                <div key={group.title} className="space-y-1">
                    <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.title}</h3>
                    {visibleItems.map(item => {
                        const isActive = activeView === item.id;
                        const showIndicator = item.id === 'analytics' && hasNewSubmission;
                        return (
                            <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id as AdminView)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 relative ${
                                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                            >
                            <item.icon className="w-6 h-6" />
                            <span>{item.label}</span>
                            {showIndicator && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                            )}
                            </button>
                        );
                    })}
                </div>
            )
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="px-4 py-3 mb-2">
            <p className="text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors duration-200"
        >
          <LogoutIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile-only backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Unified Sidebar for both mobile and desktop */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;