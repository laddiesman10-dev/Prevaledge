import React, { createContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import type {
  Service, NewService,
  Project, NewProject,
  User, NewUser,
  Client, NewClient,
  Testimonial, NewTestimonial,
  BlogPost, NewBlogPost,
  ServicePricing, PricingPlan, NewPricingPlan,
  ContactSubmission, NewContactSubmission,
  AIToolName, AIToolUsage,
  SiteDataContextType,
  ArchivedDocument, NewArchivedDocument,
  Task, NewTask, Notification,
  SocialLink, NewSocialLink,
  MarketScanner, NewMarketScanner,
  RecentActivity,
  WebinarSignup,
  NewWebinarSignup,
  JobOpening,
  NewJobOpening,
  JobApplication,
  NewJobApplication
} from '../types';
import { slugify } from '../types';
import * as api from '../services/apiService';
import AgentIcon from '../components/icons/AgentIcon';
import MetaverseIcon from '../components/icons/MetaverseIcon';
import PerformanceIcon from '../components/icons/PerformanceIcon';
import SocialIcon from '../components/icons/SocialIcon';
import ContentIcon from '../components/icons/ContentIcon';
import EcommIcon from '../components/icons/EcommIcon';
import SeoIcon from '../components/icons/SeoIcon';
import GeoIcon from '../components/icons/GeoIcon';
import { analyzeInquiry } from '../services/geminiService';
import NeuralSignatureIcon from '../components/icons/NeuralSignatureIcon';
import InstagramIcon from '../components/icons/InstagramIcon';
import TwitterIcon from '../components/icons/TwitterIcon';
import LinkedInIcon from '../components/icons/LinkedInIcon';
import LinkIcon from '../components/icons/LinkIcon';
import { aiTools } from './siteData';

// A map to get icon components from their names
const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  AgentIcon, MetaverseIcon, PerformanceIcon, SocialIcon,
  ContentIcon, EcommIcon, SeoIcon, GeoIcon, NeuralSignatureIcon,
  InstagramIcon, TwitterIcon, LinkedInIcon, LinkIcon,
};


export const serviceIconOptions = Object.keys(iconMap).filter(name => !['InstagramIcon', 'TwitterIcon', 'LinkedInIcon', 'LinkIcon'].includes(name));
export const socialIconOptions = ['InstagramIcon', 'TwitterIcon', 'LinkedInIcon'];

export const SiteDataContext = createContext<SiteDataContextType>({} as SiteDataContextType);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item, (k, v) => (k === 'submittedAt' || k === 'documentDate' || k.endsWith('Date') || k === 'createdAt' ? new Date(v) : v)) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const SiteDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [servicePricingData, setServicePricingData] = useState<ServicePricing[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [marketScanners, setMarketScanners] = useState<MarketScanner[]>([]);
  const [webinarSignups, setWebinarSignups] = useState<WebinarSignup[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Client-side state (persisted locally)
  const [contactSubmissions, setContactSubmissions] = useLocalStorage<ContactSubmission[]>('site_contactSubmissions', []);
  const [aiToolUsage, setAiToolUsage] = useLocalStorage<AIToolUsage[]>('site_aiToolUsage', []);
  const [documentHistory, setDocumentHistory] = useLocalStorage<ArchivedDocument[]>('site_documentHistory', []);
  const [recentActivity, setRecentActivity] = useLocalStorage<RecentActivity[]>('site_recentActivity', []);
  const [jobApplications, setJobApplications] = useLocalStorage<JobApplication[]>('site_jobApplications', []);
  const [hasNewSubmission, setHasNewSubmission] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const newNotification: Notification = { id: `notif-${Date.now()}`, message, type, timestamp: new Date() };
    setNotifications(prev => [...prev, newNotification]);
  }, []);
  
  const addRecentActivity = useCallback((activity: Omit<RecentActivity, 'id'>) => {
    const newActivity: RecentActivity = { ...activity, id: `activity-${Date.now()}` };
    setRecentActivity(prev => {
        const updated = [...prev, newActivity];
        // Keep only the last 20 activities to prevent local storage from growing too large
        if (updated.length > 20) {
            return updated.slice(updated.length - 20);
        }
        return updated;
    });
  }, [setRecentActivity]);


  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          servicesData, projectsData, usersData, clientsData, testimonialsData, blogPostsData,
          pricingData, socialLinksData, scannersData, tasksData, webinarSignupsData, jobOpeningsData
        ] = await Promise.all([
          api.servicesApi.getAll(),
          api.projectsApi.getAll(),
          api.usersApi.getAll(),
          api.clientsApi.getAll(),
          api.testimonialsApi.getAll(),
          api.blogPostsApi.getAll(),
          api.pricingApi.get(),
          api.socialLinksApi.getAll(),
          api.marketScannersApi.getAll(),
          api.tasksApi.getAll(),
          api.webinarSignupsApi.getAll(),
          api.jobOpeningsApi.getAll(),
        ]);
        
        setServices(servicesData);
        setProjects(projectsData);
        setUsers(usersData);
        setClients(clientsData);
        setTestimonials(testimonialsData);
        setBlogPosts(blogPostsData); // Data is already enriched with readTime at source
        setServicePricingData(pricingData);
        setSocialLinks(socialLinksData);
        setMarketScanners(scannersData);
        setTasks(tasksData);
        setWebinarSignups(webinarSignupsData);
        setJobOpenings(jobOpeningsData);

      } catch (error) {
        console.error("Failed to fetch initial site data", error);
        addNotification("Could not connect to the server. Some features may be unavailable.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [addNotification]);

  // --- ICON HYDRATION --- (Important because API returns plain JSON)
  const hydratedServices = useMemo(() => services.map(s => ({...s, icon: iconMap[s.iconName] || SeoIcon})), [services]);
  const hydratedPricingData = useMemo(() => servicePricingData.map(sp => ({...sp, icon: iconMap[sp.iconName] || SeoIcon})), [servicePricingData]);
  const hydratedSocialLinks = useMemo(() => socialLinks.map(s => ({...s, icon: iconMap[s.iconName] || LinkIcon})), [socialLinks]);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // --- API-BASED CRUD FUNCTIONS ---
  const createApiCrud = <T extends {id?: string; slug?: string;}, U>(
    stateSetter: React.Dispatch<React.SetStateAction<T[]>>,
    apiModule: { add: (item: U) => Promise<T>, update: (id: string, item: Partial<U>) => Promise<T>, remove: (id: string) => Promise<any> },
    idField: 'id' | 'slug'
  ) => {
    const add = async (itemData: U & { title?: string, name?: string}) => {
      const payload = idField === 'slug' ? { ...itemData, slug: slugify(itemData.title || itemData.name || `item-${Date.now()}`) } : itemData;
      const newItem = await apiModule.add(payload as U);
      stateSetter(prev => [newItem, ...prev]);
    };
    const update = async (id: string, itemData: Partial<U>) => {
      const updatedItem = await apiModule.update(id, itemData);
      stateSetter(prev => prev.map(item => ((item[idField] as string) === id ? updatedItem : item)));
    };
    const remove = async (id: string) => {
      await apiModule.remove(id);
      stateSetter(prev => prev.filter(item => (item[idField] as string) !== id));
    };
    return { add, update, remove };
  };

  const serviceCrud = createApiCrud<Service, NewService>(setServices, api.servicesApi, 'id');
  const projectCrud = createApiCrud<Project, NewProject>(setProjects, api.projectsApi, 'slug');
  const userCrud = createApiCrud<User, NewUser>(setUsers, api.usersApi, 'id');
  const clientCrud = createApiCrud<Client, NewClient>(setClients, api.clientsApi, 'id');
  const testimonialCrud = createApiCrud<Testimonial, NewTestimonial>(setTestimonials, api.testimonialsApi, 'id');
  const blogPostCrud = createApiCrud<BlogPost, NewBlogPost>(setBlogPosts, api.blogPostsApi, 'slug');
  const socialLinkCrud = createApiCrud<SocialLink, NewSocialLink>(setSocialLinks, api.socialLinksApi, 'id');
  const marketScannerCrud = createApiCrud<MarketScanner, NewMarketScanner>(setMarketScanners, api.marketScannersApi, 'id');
  const jobOpeningCrud = createApiCrud<JobOpening, NewJobOpening>(setJobOpenings, api.jobOpeningsApi, 'id');

  // --- TASK CRUD ---
  const addTask = async (taskData: NewTask): Promise<Task> => {
    const newTask = await api.tasksApi.add(taskData);
    setTasks(prev => [newTask, ...prev]);
    addNotification(`New task created: "${newTask.title}"`, 'success');
    return newTask;
  };
  const updateTask = async (id: string, taskData: Partial<Task>): Promise<void> => {
    const updatedTask = await api.tasksApi.update(id, taskData);
    setTasks(prev => prev.map(item => (item.id === id ? { ...item, ...updatedTask } : item)));
  };
  const deleteTask = async (id: string): Promise<void> => {
    await api.tasksApi.remove(id);
    setTasks(prev => prev.filter(item => item.id !== id));
  };
  
  // --- PRICING CRUD ---
  const updateFullPricingData = async (updatedData: ServicePricing[]) => {
    const result = await api.pricingApi.update(updatedData);
    setServicePricingData(result);
  };
  const addPricingPlan = async (serviceId: string, plan: NewPricingPlan) => {
    const updatedData = servicePricingData.map(s => s.id === serviceId ? {...s, plans: [...s.plans, {...plan, id: `plan-${Date.now()}`}]} : s);
    await updateFullPricingData(updatedData);
  };
  const updatePricingPlan = async (serviceId: string, planId: string, planData: NewPricingPlan) => {
    const updatedData = servicePricingData.map(s => s.id === serviceId ? {...s, plans: s.plans.map(p => p.id === planId ? {...p, ...planData} : p)} : s);
    await updateFullPricingData(updatedData);
  };
  const deletePricingPlan = async (serviceId: string, planId: string) => {
    const updatedData = servicePricingData.map(s => s.id === serviceId ? {...s, plans: s.plans.filter(p => p.id !== planId)} : s);
    await updateFullPricingData(updatedData);
  };
  const updateServiceDiscount = async (serviceId: string, discount: { discountPercentage?: number | null; discountEndDate?: string | null }) => {
    const updatedData = servicePricingData.map(s => s.id === serviceId ? {...s, discountPercentage: discount.discountPercentage || undefined, discountEndDate: discount.discountEndDate || undefined} : s);
    await updateFullPricingData(updatedData);
  };

  // --- CLIENT-SIDE FUNCTIONS ---
  const addContactSubmission = useCallback(async (submission: NewContactSubmission): Promise<ContactSubmission> => {
    const newSubmission: ContactSubmission = { ...submission, id: `sub-${Date.now()}`, submittedAt: new Date(), isAnalyzing: true, };
    setContactSubmissions(prev => [newSubmission, ...prev]);
    setHasNewSubmission(true);
    try {
        const { inquiryType } = await analyzeInquiry(submission.message);
        const analyzedSubmission = { ...newSubmission, inquiryType, isAnalyzing: false };
        setContactSubmissions(prev => prev.map(s => s.id === newSubmission.id ? analyzedSubmission : s));
        return analyzedSubmission;
    } catch (e) {
        console.error("AI analysis failed:", e);
        const failedSubmission = { ...newSubmission, inquiryType: 'Analysis Failed', isAnalyzing: false };
        setContactSubmissions(prev => prev.map(s => s.id === newSubmission.id ? failedSubmission : s));
        return failedSubmission;
    }
  }, [setContactSubmissions]);

  const addJobApplication = useCallback(async (applicationData: NewJobApplication): Promise<void> => {
      const newApplication: JobApplication = {
          ...applicationData,
          id: `app-${Date.now()}`,
          submittedAt: new Date(),
      };
      setJobApplications(prev => [newApplication, ...prev]);
      addNotification(`New application for ${applicationData.jobTitle} from ${applicationData.name}`, 'info');
  }, [setJobApplications, addNotification]);
  
  const logAiToolUsage = useCallback((toolName: AIToolName) => {
      setAiToolUsage(prev => [...prev, { toolName, timestamp: new Date() }]);
      const tool = aiTools.find(t => t.id === toolName);
      if(tool) {
          addRecentActivity({ type: 'TOOL_USE', text: `Someone just used the ${tool.title}.` });
      }
  }, [setAiToolUsage, addRecentActivity]);

  const addWebinarSignup = useCallback(async (signup: NewWebinarSignup): Promise<void> => {
    const newSignup = await api.webinarSignupsApi.add(signup);
    setWebinarSignups(prev => [newSignup, ...prev]);
    addRecentActivity({ type: 'WEBINAR_SIGNUP', text: `Someone just signed up for the AI Marketing Masterclass!` });
  }, [addRecentActivity]);
  
  const clearNewSubmission = useCallback(() => setHasNewSubmission(false), []);
  const addDocumentToHistory = async (document: NewArchivedDocument) => {
    const newDocWithId = { 
      ...document, 
      id: `doc-${Date.now()}`
    };
    setDocumentHistory(prev => [newDocWithId, ...prev]);
  };
  const updateDocumentStatusInHistory = async (documentId: string, paymentStatus: 'paid' | 'unpaid') => { setDocumentHistory(prev => prev.map(d => d.id === documentId ? {...d, paymentStatus} : d)); };
  const deleteDocumentFromHistory = async (documentId: string) => { setDocumentHistory(prev => prev.filter(d => d.id !== documentId)); };
  
  const value: SiteDataContextType = {
    services: hydratedServices, projects, users, clients, testimonials, blogPosts, servicePricingData: hydratedPricingData,
    socialLinks: hydratedSocialLinks, contactSubmissions, aiToolUsage, documentHistory, tasks, marketScanners, hasNewSubmission, notifications,
    webinarSignups, recentActivity, jobOpenings, jobApplications,
    addService: serviceCrud.add, updateService: serviceCrud.update, deleteService: serviceCrud.remove,
    addProject: projectCrud.add, updateProject: projectCrud.update, deleteProject: projectCrud.remove,
    addUser: userCrud.add, updateUser: userCrud.update, deleteUser: userCrud.remove,
    addClient: clientCrud.add, updateClient: clientCrud.update, deleteClient: clientCrud.remove,
    addTestimonial: testimonialCrud.add, updateTestimonial: testimonialCrud.update, deleteTestimonial: testimonialCrud.remove,
    addBlogPost: blogPostCrud.add, updateBlogPost: blogPostCrud.update, deleteBlogPost: blogPostCrud.remove,
    addPricingPlan, updatePricingPlan, deletePricingPlan, updateServiceDiscount,
    addSocialLink: socialLinkCrud.add, updateSocialLink: socialLinkCrud.update, deleteSocialLink: socialLinkCrud.remove,
    addMarketScanner: marketScannerCrud.add, updateMarketScanner: marketScannerCrud.update, deleteMarketScanner: marketScannerCrud.remove,
    addJobOpening: jobOpeningCrud.add, updateJobOpening: jobOpeningCrud.update, deleteJobOpening: jobOpeningCrud.remove,
    addJobApplication,
    addTask, updateTask, deleteTask,
    addNotification, removeNotification,
    addContactSubmission,
    addWebinarSignup,
    logAiToolUsage,
    clearNewSubmission,
    addDocumentToHistory,
    updateDocumentStatusInHistory,
    deleteDocumentFromHistory,
    addRecentActivity,
  };

  return (
    <SiteDataContext.Provider value={value}>
        {isLoading ? null : children}
    </SiteDataContext.Provider>
  );
};