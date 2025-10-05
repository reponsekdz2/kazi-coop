import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    const userToLogin = USERS.find(u => u.role === role);
    if (userToLogin) {
      setUser(userToLogin);
    } else {
        console.error("No user found for role:", role);
        // Fallback to first user if specific role not found in mock data
        setUser(USERS[0]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
