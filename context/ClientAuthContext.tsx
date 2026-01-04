import React, { createContext, useState, ReactNode, useCallback, useEffect, useContext } from 'react';
import { Client, ClientAuthContextType, RouterContext } from '../types';
import { SiteDataContext } from '../data/siteDataContext';

export const ClientAuthContext = createContext<ClientAuthContextType>({} as ClientAuthContextType);

export const ClientAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { navigate } = useContext(RouterContext);
  const { clients } = useContext(SiteDataContext); 

  useEffect(() => {
    const checkSession = () => {
      try {
        const storedClientId = window.localStorage.getItem('prevaledge_client_id');
        if (storedClientId) {
          const client = clients.find(c => c.id === storedClientId);
          if (client) {
            setCurrentClient(client);
          } else {
            // Clear invalid session
            window.localStorage.removeItem('prevaledge_client_id');
          }
        }
      } catch (e) {
        console.error("Failed to restore client session", e);
        window.localStorage.removeItem('prevaledge_client_id');
      } finally {
        setAuthLoading(false);
      }
    };
    
    // Only check session after clients are loaded from the main context
    if (clients.length > 0) {
      checkSession();
    } else {
      setAuthLoading(false);
    }
  }, [clients]);

  const login = useCallback(async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (client) {
          setCurrentClient(client);
          window.localStorage.setItem('prevaledge_client_id', client.id);
          navigate('/portal');
          resolve();
        } else {
          reject(new Error('No client account found with that email address.'));
        }
      }, 500);
    });
  }, [clients, navigate]);

  const logout = useCallback(() => {
    setCurrentClient(null);
    window.localStorage.removeItem('prevaledge_client_id');
    navigate('/login');
  }, [navigate]);

  // Don't render children until session check is complete
  if (authLoading) {
    return null;
  }

  const value = { currentClient, login, logout };

  return <ClientAuthContext.Provider value={value}>{children}</ClientAuthContext.Provider>;
};

export const useClientAuth = () => useContext(ClientAuthContext);
