'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // For development, we'll use mock authentication
        const savedUser = localStorage.getItem('caps-ca-user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Check if the user session is still valid (not expired)
          const lastLogin = new Date(parsedUser.last_login || parsedUser.created_at);
          const now = new Date();
          const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
          
          // Session expires after 24 hours
          if (hoursSinceLogin < 24) {
            setUser(parsedUser);
          } else {
            // Session expired, clear it
            localStorage.removeItem('caps-ca-user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear invalid session data
        localStorage.removeItem('caps-ca-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication for development
      let mockUser: User | null = null;
      
      if (email === 'ca.student@demo.com' && password === 'demo123') {
        mockUser = {
          id: 'ca-student-1',
          email: 'ca.student@demo.com',
          full_name: 'Rahul Sharma',
          role: 'student',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };
      } else if (email === 'ca.instructor@demo.com' && password === 'demo123') {
        mockUser = {
          id: 'ca-instructor-1',
          email: 'ca.instructor@demo.com',
          full_name: 'Dr. Rajdeep Manwani',
          role: 'instructor',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };
      } else if (email === 'admin@demo.com' && password === 'demo123') {
        mockUser = {
          id: 'admin-1',
          email: 'admin@demo.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };
      } else {
        return { 
          success: false, 
          error: 'Invalid credentials. Please use the demo credentials provided.' 
        };
      }

      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('caps-ca-user', JSON.stringify(mockUser));
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      // Mock registration for development
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        role: role as 'student' | 'instructor',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('caps-ca-user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('caps-ca-user');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { 
          ...user, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        setUser(updatedUser);
        localStorage.setItem('caps-ca-user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const savedUser = localStorage.getItem('caps-ca-user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 