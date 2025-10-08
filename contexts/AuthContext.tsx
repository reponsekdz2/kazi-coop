import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';
// import api from '../services/api'; // Mocking API calls for now

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (details: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user on initial load
    const checkLoggedInUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedInUser();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    // In a real app, this would be an API call
    // For this mock, we'll find a user in our constants
    const foundUser = users.find(u => u.email === credentials.email);
    if (foundUser) { // a real app would check password
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid email or password');
    }
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    // In a real app, you might want to call an API endpoint to invalidate a token
  }, []);

  const register = useCallback(async (details: { name: string; email: string; password: string; role: UserRole }) => {
    // In a real app, this would be an API call
    if (users.some(u => u.email === details.email)) {
      throw new Error('User with this email already exists');
    }
    const newUser: User = {
      id: `u-${users.length + 1}`,
      name: details.name,
      email: details.email,
      role: details.role,
      avatarUrl: `https://i.pravatar.cc/150?u=${details.email}`,
      notificationSettings: { jobAlerts: true, messageAlerts: true, coopUpdates: false }
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, [users]);
  
  const updateUserProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);


  return (
    <AuthContext.Provider value={{ user, users, isLoading, login, logout, register, updateUserProfile }}>
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
