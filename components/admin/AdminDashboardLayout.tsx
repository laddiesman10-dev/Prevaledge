import React, { useState, useContext } from 'react';
import AdminSidebar from './AdminSidebar';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import { RouterContext, AdminView, User, Permission } from '../../types';
import { SiteDataContext } from '../../data/siteDataContext';
import NewLeadToast from './NewLeadToast';
import NotificationCenter from './ui/NotificationCenter';

interface AdminDashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  hasPermission: (permission: Permission) => boolean;
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ currentUser, onLogout, activeView, setActiveView, hasPermission, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { navigate } = useContext(RouterContext);
  const { hasNewSubmission, clearNewSubmission } = useContext(SiteDataContext);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleViewLeads = () => {
    setActiveView('analytics');
    clearNewSubmission();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      <AdminSidebar 
        currentUser={currentUser}
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        hasPermission={hasPermission}
      />
      
      <div className="flex-1 flex flex-col">
         {/* Mobile Header */}
        <header className="lg:hidden bg-slate-950/70 backdrop-blur-lg border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-20">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-2 text-lg font-bold text-slate-100">
                <BrainCircuitIcon className="w-6 h-6 text-blue-400" />
                <span>Prevaledge</span>
            </a>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950 bg-grid-pattern">
          {children}
        </main>
      </div>
      
      <NotificationCenter />
      
      {hasNewSubmission && (
        <NewLeadToast 
            onViewClick={handleViewLeads} 
            onClose={clearNewSubmission} 
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout;