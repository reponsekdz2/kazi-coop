import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';
// FIX: Import mock users data.
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  // FIX: Added users array to the context type.
  users: User[];
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string, password: string }) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // FIX: Added users state, initialized with mock data.
  const [users, setUsers] = useState<User[]>(USERS);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(parsedUser.token);
          // Verify token by fetching profile
          const profile = await api.get<User>('/users/profile');
          setUser(profile);
        }
      } catch (error) {
        console.error("Session expired or invalid", error);
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = useCallback(async (credentials: { email: string, password: string }) => {
    const data = await api.post<User & { token: string }>('/auth/login', credentials);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify({ token: data.token }));
  }, []);
  
  const register = useCallback(async (details: any) => {
    const data = await api.post<User & { token: string }>('/auth/register', details);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify({ token: data.token }));
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
  }, []);

  const updateUserProfile = useCallback(async (updatedData: Partial<User>) => {
    const updatedUser = await api.put<User>('/users/profile', updatedData);
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, token, isLoading, login, register, logout, updateUserProfile }}>
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
