import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[]; // Expose all users for messaging/transfers
  login: (role: UserRole) => void;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });
  
  // Keep a mutable copy of users in state to allow for updates
  const [users, setUsers] = useState<User[]>(USERS);

  const login = useCallback((role: UserRole) => {
    // Find the first user that matches the role for demo purposes
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUserProfile = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUserProfile }}>
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