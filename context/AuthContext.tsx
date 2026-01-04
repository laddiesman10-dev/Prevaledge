import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { loginUser } from '../services/apiService';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for an existing session in local storage on app load.
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = window.localStorage.getItem('prevaledge_auth_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to restore session", e);
        setCurrentUser(null);
        window.localStorage.removeItem('prevaledge_auth_user');
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const user = await loginUser(email, password); // Use the new API service
      setCurrentUser(user);
      window.localStorage.setItem('prevaledge_auth_user', JSON.stringify(user)); // Persist for session restore
    } catch (error) {
      // Re-throw the error to be handled by the login form
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    window.localStorage.removeItem('prevaledge_auth_user');
  }, []);

  // Render nothing while checking auth to prevent layout flashes.
  // The preloader in index.html will cover this initial period.
  if (authLoading) {
    return null;
  }

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
