import React, { useState, useContext, useCallback, lazy, Suspense } from 'react';
import LoginPage from '../components/admin/LoginPage';
import AdminDashboardLayout from '../components/admin/AdminDashboardLayout';
import DashboardView from '../components/admin/views/DashboardView';
import BlogManagementView from '../components/admin/views/BlogManagementView';
import ProjectManagementView from '../components/admin/views/ProjectManagementView';
import ServicesManagementView from '../components/admin/views/ServicesManagementView';
import UserManagementView from '../components/admin/views/TeamManagementView';
import ClientManagementView from '../components/admin/views/ClientManagementView';
import TestimonialManagementView from '../components/admin/views/TestimonialManagementView';
import AnalyticsView from '../components/admin/views/AnalyticsView';
import PricingManagementView from '../components/admin/views/PricingManagementView';
import InvoiceGeneratorView from '../components/admin/views/InvoiceGeneratorView';
import QuotationGeneratorView from '../components/admin/views/QuotationGeneratorView';
import DocumentHistoryView from '../components/admin/views/DocumentHistoryView';
import TaskManagementView from '../components/admin/views/TaskManagementView';
import type { AdminView, Permission } from '../types';
import { AuthContext } from '../context/AuthContext';
import SocialsManagementView from '../components/admin/views/SocialsManagementView';
import StrategistView from '../components/admin/views/StrategistView';
import HorizonScannerView from '../components/admin/views/HorizonScannerView';
import CareerManagementView from '../components/admin/views/CareerManagementView';
import JobApplicationsView from '../components/admin/views/JobApplicationsView';
import LeadGenNurtureView from '../components/admin/views/LeadGenNurtureView';


const LoadingFallback: React.FC = () => (
    <div className="p-8 text-center text-slate-400">Loading component...</div>
);

const AdminPanel: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    // 'dashboard' is always allowed for any logged-in user
    if (permission === 'dashboard') return true;
    return currentUser.permissions?.includes(permission) ?? false;
  }, [currentUser]);

  const renderContent = () => {
    if (!currentUser) return null;

    // If a user tries to access a view they don't have permission for, redirect them to the dashboard.
    if (!hasPermission(activeView)) {
        // Use a state update in a timeout to avoid issues with rendering during another render pass
        setTimeout(() => setActiveView('dashboard'), 0);
        return <DashboardView setActiveView={setActiveView} />;
    }

    switch (activeView) {
      case 'blog':
        return <BlogManagementView />;
      case 'projects':
        return <ProjectManagementView />;
      case 'services':
        return <ServicesManagementView />;
      case 'users':
        return <UserManagementView />;
      case 'clients':
        return <ClientManagementView />;
      case 'testimonials':
        return <TestimonialManagementView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'pricing':
        return <PricingManagementView />;
      case 'invoicing':
        return <InvoiceGeneratorView />;
      case 'quotations':
        return <QuotationGeneratorView />;
      case 'documentHistory':
        return <DocumentHistoryView />;
      case 'tasks':
        return <TaskManagementView />;
      case 'socials':
        return <SocialsManagementView />;
      case 'strategist':
        return <StrategistView />;
      case 'horizonScanner':
        return <HorizonScannerView />;
      case 'careers':
        return <CareerManagementView />;
      case 'jobApplications':
        return <JobApplicationsView />;
      case 'leadGenNurture':
        return <LeadGenNurtureView />;
      case 'dashboard':
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  };

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <AdminDashboardLayout 
      currentUser={currentUser}
      onLogout={logout}
      activeView={activeView}
      setActiveView={setActiveView}
      hasPermission={hasPermission}
    >
      {renderContent()}
    </AdminDashboardLayout>
  );
};

export default AdminPanel;