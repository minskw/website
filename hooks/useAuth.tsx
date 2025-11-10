
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  username: string;
  role: 'Super Admin' | 'Editor';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in session storage
    try {
      const storedUser = sessionStorage.getItem('min-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Mock API call
    return new Promise(resolve => {
      setTimeout(() => {
        if ((username === 'admin' || username === 'editor') && pass === 'password') {
          const newUser: User = { 
            username, 
            role: username === 'admin' ? 'Super Admin' : 'Editor' 
          };
          setUser(newUser);
          sessionStorage.setItem('min-user', JSON.stringify(newUser));
          setLoading(false);
          resolve(true);
        } else {
          setLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('min-user');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
