import React from 'react';
import type { Chat } from '@google/genai';

// General
export const SITE_URL = 'https://prevaledge.com';

// Router
export const RouterContext = React.createContext<RouterContextType>({} as RouterContextType);

export interface RouterContextType {
  route: string;
  navigate: (path: string) => void;
}

// Client Authentication
export interface ClientAuthContextType {
  currentClient: Client | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}
export const ClientAuthContext = React.createContext<ClientAuthContextType>({} as ClientAuthContextType);


// Utility function
export const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


// Data Models
export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  detailedDescription: string;
  keyOfferings: string[];
}
export type NewService = Omit<Service, 'id' | 'icon'>;

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  clientId?: string;
  showOnHomepage?: boolean;
  caseStudy: {
    challenge: string;
    solution: string;
    results: string;
    keyMetrics: { value: string; label: string }[];
  };
}
export type NewProject = Omit<Project, 'id'>;

export type UserRole = 'Admin' | 'Editor';
export type Permission = AdminView;

export interface User {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  password?: string;
  role: UserRole;
  permissions?: Permission[];
}
export type NewUser = Omit<User, 'id'>;


export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
}
export type NewClient = Omit<Client, 'id'>;


export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
}
export type NewTestimonial = Omit<Testimonial, 'id'>;


export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime: number;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}
export type NewBlogPost = Omit<BlogPost, 'readTime'>;

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  priceDetail?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}
export type NewPricingPlan = Omit<PricingPlan, 'id'>;

export interface ServicePricing {
  id: string;
  serviceTitle: string;
  iconName: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  plans: PricingPlan[];
  discountPercentage?: number;
  discountEndDate?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
export type NewSocialLink = Omit<SocialLink, 'id' | 'icon'>;

export interface MarketScanner {
    id: string;
    name: string;
    targetClientId: string;
    industry: string;
    competitors: string[];
}
export type NewMarketScanner = Omit<MarketScanner, 'id'>;

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
  assignedTo?: string;
  relatedProject?: string;
  subTasks: SubTask[];
  attachments: Attachment[];
  dependencies: string[];
}
export type NewTask = Omit<Task, 'id' | 'createdAt'>;

export interface RecentActivity {
  id: string;
  type: 'TOOL_USE' | 'WEBINAR_SIGNUP';
  text: string;
}

export interface WebinarSignup {
  id: string;
  email: string;
  signedUpAt: Date;
}
export type NewWebinarSignup = Omit<WebinarSignup, 'id' | 'signedUpAt'>;

export interface Perk {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface JobOpening {
    id: string;
    title: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Internship';
    description: string;
    responsibilities: string[];
    qualifications: string[];
    datePosted: string;
}
export type NewJobOpening = Omit<JobOpening, 'id' | 'datePosted'>;

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resume: {
      filename: string;
      dataUrl: string;
  };
  submittedAt: Date;
}
export type NewJobApplication = Omit<JobApplication, 'id' | 'submittedAt'>;


// AI Tools
// FIX: Add 'clientProspectAnalyzer' to AIToolName type.
export type AIToolName = 'strategyGenerator' | 'websiteAnalyzer' | 'adCopyGenerator' | 'blogIdeaGenerator' | 'keywordClusterGenerator' | 'socialPostGenerator' | 'roiCalculator' | 'competitorSnapshot' | 'seoContentGrader' | 'nicheNavigator' | 'articleDrafter' | 'contentBriefGenerator' | 'clientProspectAnalyzer' | 'leadGenNurture';

export interface AITool {
  id: AIToolName;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  component: React.FC;
}

export interface AIToolUsage {
  toolName: AIToolName;
  timestamp: Date;
}

// AI Tool Result Types
export interface HoloscanResultCategory {
    score: number;
    feedback: string;
    recommendations: string;
}
export interface HoloscanResult {
    overallScore: number;
    executiveSummary: string;
    seo: HoloscanResultCategory;
    ux: HoloscanResultCategory;
    performance: HoloscanResultCategory;
    security: HoloscanResultCategory;
}

export interface CompetitorAnalysis {
    url: string;
    estimatedTraffic: string;
    domainAuthority: number;
    topKeywords: string[];
    keyStrengths: string[];
}
export interface CompetitorSnapshotResult {
    yourSite: CompetitorAnalysis;
    competitorSite: CompetitorAnalysis;
    opportunityAnalysis: string;
}

export interface AdCopyResult {
  headlines: string[];
  descriptions: string[];
}

export interface BlogIdea {
    title: string;
    hook: string;
    keywords: string[];
}

export interface KeywordCluster {
    clusterTitle: string;
    keywords: string[];
}

export interface SocialPostResult {
    post: string;
    hashtags: string[];
    visualSuggestion: string;
}

export interface NicheProfileResult {
    niche: string;
    description: string;
    targetAudience: string;
    usp: string;
    contentAngles: string[];
    keywords: string[];
}

export interface SeoContentAnalysisCategory {
  score: number;
  feedback: string[];
}
export interface SeoContentGraderResult {
  overallScore: number;
  executiveSummary: string;
  keywordOptimization: SeoContentAnalysisCategory;
  readabilityAndStructure: SeoContentAnalysisCategory;
  semanticSeo: SeoContentAnalysisCategory;
  expertiseAndTrust: SeoContentAnalysisCategory;
}

export type ArticleDraftResult = string;

export interface ContentBriefResult {
    targetAudience: string;
    searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
    suggestedTitle: string;
    keyHeadings: string[];
    semanticKeywords: string[];
    internalLinkSuggestions: {
        anchorText: string;
        url: string;
    }[];
    competitorAnalysis: {
        title: string;
        strength: string;
    }[];
}

// FIX: Add missing AI Tool Result Types for Client Prospect Analyzer.
export interface TechnicalSeoAudit {
    coreWebVitals: {
        status: 'Good' | 'Needs Improvement' | 'Poor';
        details: string;
    };
    mobileFriendliness: {
        status: 'Good' | 'Needs Improvement' | 'Poor';
        details: string;
    };
    schemaMarkup: {
        status: 'Present' | 'Missing' | 'Incomplete';
        details: string;
    };
    siteSpeed: {
        status: 'Fast' | 'Average' | 'Slow';
        details: string;
    };
    security: {
        https: boolean;
        details: string;
    };
    crawlability: {
        status: 'Good' | 'Has Issues';
        details: string;
    };
}

export interface RoiAnalysis {
    projectedImpact: string;
    assumptions: string[];
    estimatedRoiPercentage: number;
    timeline: string;
}

export interface SolutionStep {
  phaseName: string;
  timeline: string;
  services: string[];
  description: string;
  keyActivities: string[];
  kpisToTrack: string[];
  expectedOutcome: string;
}

export interface SocialPlatformAnalysis {
    platformScore: number;
    followerCount: string;
    postingFrequency: string;
    engagementAnalysis: string;
    contentStrategyAnalysis: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}

export interface ClientProspectAnalysisResult {
  companyName: string;
  summary: string;
  estimatedValue: string;
  estimatedBusinessImpact: string;
  overallScore: number;
  technicalHealthScore: number;
  contentAuthorityScore: number;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  socialPresenceAnalysis: {
    linkedIn?: SocialPlatformAnalysis;
    twitter?: SocialPlatformAnalysis;
    instagram?: SocialPlatformAnalysis;
    facebook?: SocialPlatformAnalysis;
  };
  painPoints: string[];
  decisionMakerPersonas: {
    title: string;
    likelyGoals: string[];
  }[];
  talkingPoints: string[];
  outreachDraft: string;
  competitiveLandscape: {
    identifiedCompetitors: { name: string; url: string }[];
    keywordGaps: string[];
    opportunitySummary: string;
  };
  solutionRoadmap: SolutionStep[];
  emailSequence: {
    subject: string;
    body: string;
    sendDelayDays: number;
  }[];
  technologyStack: {
      name: string;
      category: 'CMS' | 'Analytics' | 'Marketing' | 'Framework' | 'Other';
  }[];
  quickWins: string[];
  valuePropositionAnalysis: {
      statedUSP: string;
      effectiveness: string;
      recommendations: string;
  };
  technicalSeoAudit: TechnicalSeoAudit;
  roiAnalysis: RoiAnalysis;
}

// Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}


// Admin Panel
// FIX: Add 'liveStrategist' to the AdminView type to allow it as a valid permission.
export type AdminView = 'dashboard' | 'analytics' | 'blog' | 'projects' | 'services' | 'users' | 'clients' | 'testimonials' | 'pricing' | 'invoicing' | 'quotations' | 'documentHistory' | 'tasks' | 'socials' | 'strategist' | 'liveStrategist' | 'horizonScanner' | 'careers' | 'jobApplications' | 'leadGenNurture';

// Live Agent
export type LiveAgentStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking' | 'error';
export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
  toolResult?: {
    functionName: string;
    result: any;
  };
}
export interface ConsultationResult {
    message: string;
    name: string;
    email: string;
}
export interface ContentResult {
    items: {
        type: 'Case Study' | 'Blog Post';
        title: string;
        url: string;
    }[];
}
export interface ServiceInfoResult {
    title: string;
    description: string;
    keyOfferings: string[];
}
export type ToolResultContent = ConsultationResult | ContentResult | ServiceInfoResult;


// Forms & Submissions
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  message: string;
  submittedAt: Date;
  inquiryType?: string;
  isAnalyzing: boolean;
}
export type NewContactSubmission = Omit<ContactSubmission, 'id' | 'submittedAt' | 'inquiryType' | 'isAnalyzing'>;

// Documents
export interface DocumentLineItem {
    id: number;
    description: string;
    quantity: string;
    price: string;
}
export interface ArchivedDocument {
    id: string;
    publicId: string;
    documentType: 'Invoice' | 'Quotation';
    documentNumber: string;
    documentDate: string;
    dueDate?: string;
    companyDetails: { name: string; address: string; email: string; };
    clientDetails: { name: string; company: string; address: string; email: string; };
    clientId?: string;
    lineItems: DocumentLineItem[];
    notes: string;
    taxRate: string;
    discountType: 'Percentage' | 'Fixed';
    discountValue: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    logo: string | null;
    accentColor: string;
    currency: string;
    showBarcode: boolean;
    paymentStatus?: 'paid' | 'unpaid';
    paymentLink?: string;
}
export type NewArchivedDocument = Omit<ArchivedDocument, 'id'>;

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteDataContextType {
  services: Service[];
  projects: Project[];
  users: User[];
  clients: Client[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  servicePricingData: ServicePricing[];
  socialLinks: SocialLink[];
  contactSubmissions: ContactSubmission[];
  aiToolUsage: AIToolUsage[];
  documentHistory: ArchivedDocument[];
  tasks: Task[];
  marketScanners: MarketScanner[];
  webinarSignups: WebinarSignup[];
  jobOpenings: JobOpening[];
  jobApplications: JobApplication[];
  hasNewSubmission: boolean;
  notifications: Notification[];
  recentActivity: RecentActivity[];
  
  addService: (service: NewService) => Promise<void>;
  updateService: (id: string, service: Partial<NewService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addProject: (project: NewProject) => Promise<void>;
  updateProject: (slug: string, project: Partial<NewProject>) => Promise<void>;
  deleteProject: (slug: string) => Promise<void>;

  addUser: (user: NewUser) => Promise<void>;
  updateUser: (id: string, user: Partial<NewUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  addClient: (client: NewClient) => Promise<void>;
  updateClient: (id: string, client: Partial<NewClient>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addTestimonial: (testimonial: NewTestimonial) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<NewTestimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  addBlogPost: (post: NewBlogPost) => Promise<void>;
  updateBlogPost: (slug: string, post: Partial<NewBlogPost>) => Promise<void>;
  deleteBlogPost: (slug: string) => Promise<void>;

  addPricingPlan: (serviceId: string, plan: NewPricingPlan) => Promise<void>;
  updatePricingPlan: (serviceId: string, planId: string, planData: NewPricingPlan) => Promise<void>;
  deletePricingPlan: (serviceId: string, planId: string) => Promise<void>;
  updateServiceDiscount: (serviceId: string, discount: { discountPercentage?: number | null; discountEndDate?: string | null; }) => Promise<void>;

  addSocialLink: (link: NewSocialLink) => Promise<void>;
  updateSocialLink: (id: string, link: Partial<NewSocialLink>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  
  addMarketScanner: (scanner: NewMarketScanner) => Promise<void>;
  updateMarketScanner: (id: string, scanner: Partial<NewMarketScanner>) => Promise<void>;
  deleteMarketScanner: (id: string) => Promise<void>;
  
  addJobOpening: (job: NewJobOpening) => Promise<void>;
  updateJobOpening: (id: string, job: Partial<NewJobOpening>) => Promise<void>;
  deleteJobOpening: (id: string) => Promise<void>;

  addJobApplication: (application: NewJobApplication) => Promise<void>;

  addTask: (task: NewTask) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;

  addContactSubmission: (submission: NewContactSubmission) => Promise<ContactSubmission>;
  
  addWebinarSignup: (signup: NewWebinarSignup) => Promise<void>;

  logAiToolUsage: (toolName: AIToolName) => void;
  clearNewSubmission: () => void;

  addDocumentToHistory: (document: NewArchivedDocument) => Promise<void>;
  updateDocumentStatusInHistory: (documentId: string, paymentStatus: 'paid' | 'unpaid') => Promise<void>;
  deleteDocumentFromHistory: (documentId: string) => Promise<void>;
  
  addRecentActivity: (activity: Omit<RecentActivity, 'id'>) => void;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


export interface ScannerInsight {
  type: ScannerInsightType;
  title: string;
  description: string;
  suggestion: string;
}

export type ScannerInsightType = 'EMERGING_TREND' | 'COMPETITOR_MOVE' | 'CONTENT_GAP' | 'OPPORTUNITY';

export interface SocialCampaign {
  tweets: string[];
  linkedinPost: string;
}