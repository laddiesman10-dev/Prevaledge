// services/apiService.ts

// This file simulates a backend API for demonstration purposes.
// It uses in-memory data stores and returns promises to mimic network latency.

import type {
  Service, NewService, Project, NewProject, User, NewUser, Client, NewClient,
  Testimonial, NewTestimonial, BlogPost, NewBlogPost, ServicePricing,
  SocialLink, NewSocialLink, MarketScanner, NewMarketScanner, Task, NewTask,
  WebinarSignup, NewWebinarSignup, JobOpening, NewJobOpening
} from '../types';

import {
  initialServices, initialProjects, initialUsers, initialClients, initialTestimonials,
  initialBlogPosts, initialServicePricingData, initialSocialLinks, initialMarketScanners, initialTasks,
  initialJobOpenings
} from '../data/siteData';


// --- In-Memory Data Stores ---
let services: Service[] = [...initialServices];
let projects: Project[] = [...initialProjects];
let users: User[] = [...initialUsers];
let clients: Client[] = [...initialClients];
let testimonials: Testimonial[] = [...initialTestimonials];
let blogPosts: BlogPost[] = [...initialBlogPosts];
let servicePricingData: ServicePricing[] = [...initialServicePricingData];
let socialLinks: SocialLink[] = [...initialSocialLinks];
let marketScanners: MarketScanner[] = [...initialMarketScanners];
let tasks: Task[] = [...initialTasks];
let webinarSignups: WebinarSignup[] = [];
let jobOpenings: JobOpening[] = [...initialJobOpenings];


// --- Mock API Helpers ---
const MOCK_API_DELAY = 300; // ms

// Helper to simulate a network request with a delay
const mockFetch = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Deep copy to prevent direct mutation of the in-memory store
      resolve(JSON.parse(JSON.stringify(data)));
    }, MOCK_API_DELAY);
  });
};

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


// --- Auth API ---
export const loginUser = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.email === email);
            if (user && user.password === password) {
                // Don't send password back to the client
                const { password: _, ...userWithoutPassword } = user;
                resolve(userWithoutPassword);
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, MOCK_API_DELAY);
    });
};


// --- Generic CRUD Endpoints Factory for Mock Data ---
const createMockApiEndpoints = <T extends {id?: string; slug?: string;}, U>(
    dataStore: T[],
    idField: 'id' | 'slug'
) => {
  return {
    getAll: (): Promise<T[]> => mockFetch(dataStore),
    
    getById: (id: string): Promise<T> => {
      const item = dataStore.find(d => (d[idField] as string) === id);
      return item ? mockFetch(item) : Promise.reject(new Error('Item not found.'));
    },

    add: (itemData: U & { title?: string; name?: string; signedUpAt?: Date, qualifications?: any }): Promise<T> => {
        const isJobOpening = 'qualifications' in itemData && 'responsibilities' in itemData;
        const newItem = {
            ...itemData,
            [idField]: idField === 'slug'
                ? slugify(itemData.title || itemData.name || `item-${Date.now()}`)
                : `item-${Date.now()}`,
            // Special handling for new tasks needing a createdAt date
            ...((itemData as any).status && !(itemData as any).createdAt && { createdAt: new Date().toISOString() }),
            ...((itemData as any).email && !(itemData as any).signedUpAt && { signedUpAt: new Date().toISOString() }),
            ...(isJobOpening && { datePosted: new Date().toISOString() }),
        } as unknown as T;
        (dataStore as any[]).unshift(newItem);
        return mockFetch(newItem);
    },

    update: (id: string, itemData: Partial<U>): Promise<T> => {
      let updatedItem: T | undefined;
      const newDataStore = dataStore.map(item => {
        if ((item[idField] as string) === id) {
          updatedItem = { ...item, ...itemData };
          return updatedItem;
        }
        return item;
      }) as T[];
      Object.assign(dataStore, newDataStore);
      return updatedItem ? mockFetch(updatedItem) : Promise.reject(new Error('Item not found for update.'));
    },

    remove: (id: string): Promise<void> => {
      const initialLength = dataStore.length;
      const newDataStore = dataStore.filter(item => (item[idField] as string) !== id);
      if (newDataStore.length === initialLength) {
        return Promise.reject(new Error('Item not found for deletion.'));
      }
      dataStore.length = 0;
      Array.prototype.push.apply(dataStore, newDataStore);
      return mockFetch(undefined).then(() => {});
    },
  };
};

// Create and export the mock API endpoints
export const servicesApi = createMockApiEndpoints<Service, NewService>(services, 'id');
export const projectsApi = createMockApiEndpoints<Project, NewProject>(projects, 'slug');
export const usersApi = createMockApiEndpoints<User, NewUser>(users, 'id');
export const clientsApi = createMockApiEndpoints<Client, NewClient>(clients, 'id');
export const testimonialsApi = createMockApiEndpoints<Testimonial, NewTestimonial>(testimonials, 'id');
export const blogPostsApi = createMockApiEndpoints<BlogPost, NewBlogPost>(blogPosts, 'slug');
export const socialLinksApi = createMockApiEndpoints<SocialLink, NewSocialLink>(socialLinks, 'id');
export const marketScannersApi = createMockApiEndpoints<MarketScanner, NewMarketScanner>(marketScanners, 'id');
export const tasksApi = createMockApiEndpoints<Task, NewTask>(tasks, 'id');
export const webinarSignupsApi = createMockApiEndpoints<WebinarSignup, NewWebinarSignup>(webinarSignups, 'id');
export const jobOpeningsApi = createMockApiEndpoints<JobOpening, NewJobOpening>(jobOpenings, 'id');


// --- Special API Endpoints ---

// Pricing is a single object/document, not a collection of items with IDs.
export const pricingApi = {
    get: (): Promise<ServicePricing[]> => mockFetch(servicePricingData),
    update: (data: ServicePricing[]): Promise<ServicePricing[]> => {
        servicePricingData = [...data]; // Replace the whole array
        return mockFetch(servicePricingData);
    },
};

// Email sending
interface EmailPayload {
    to: string;
    from: string;
    subject: string;
    body: string;
    documentHtml: string;
}

export const emailApi = {
    sendDocumentEmail: (payload: EmailPayload): Promise<{ success: boolean }> => {
        console.log("Simulating email send:", payload);
        // Simulate a successful API call
        return mockFetch({ success: true });
    }
};