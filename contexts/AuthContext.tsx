
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';
import { useToast } from './ToastContext';

type UserCredentials = {
  email: string;
  password?: string;
};

type RegisterData = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory user store for simulation
let userStore: User[] = [...USERS];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  // Simulate checking for an existing session
  useState(() => {
    // To keep a user logged in across refreshes in a real app, you'd check localStorage/sessionStorage here.
    // For this mock, we start fresh.
    setIsLoading(false);
  });
  
  const login = useCallback(async (credentials: UserCredentials) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = userStore.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (foundUser) {
          setUser(foundUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    addToast('You have been logged out.', 'info');
  }, [addToast]);
  
  const register = useCallback(async (data: RegisterData) => {
      return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
              const existingUser = userStore.find(u => u.email.toLowerCase() === data.email.toLowerCase());
              if (existingUser) {
                  return reject(new Error('A user with this email already exists.'));
              }
              const newUser: User = {
                  id: `u-${userStore.length + 1}`,
                  name: data.name,
                  email: data.email,
                  role: data.role,
                  avatarUrl: `https://i.pravatar.cc/150?u=${data.email}`,
                  notificationSettings: {
                      jobAlerts: true,
                      messageAlerts: true,
                      coopUpdates: true,
                  },
                  careerProgress: 1,
                  skills: [],
              };
              userStore.push(newUser);
              setUser(newUser);
              resolve();
          }, 500);
      });
  }, []);


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
