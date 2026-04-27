import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';
import type { User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to fetch current user from backend
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User is not authenticated, clear user state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    await authApi.login({ username, password });
    // Fetch the actual user from backend after login
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // If getCurrentUser fails, still consider login successful
      // The backend login endpoint may have set the session
      console.error('Failed to fetch user after login:', error);
    }
  };

  const register = async (username: string, password: string) => {
    await authApi.register({ username, password });
    // After registration, user needs to login
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
