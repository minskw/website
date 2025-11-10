import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Parent, Student } from '../types';
import { mockParents, mockStudents } from '../services/mockApi';

interface ParentAuthContextType {
  parent: Parent | null;
  student: Student | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const ParentAuthContext = createContext<ParentAuthContextType | null>(null);

export const ParentAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parent, setParent] = useState<Parent | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in parent in session storage
    try {
      const storedParent = sessionStorage.getItem('min-parent');
      if (storedParent) {
        const parsedParent: Parent = JSON.parse(storedParent);
        setParent(parsedParent);
        const associatedStudent = mockStudents.find(s => s.id === parsedParent.studentId);
        if(associatedStudent) {
            setStudent(associatedStudent);
        }
      }
    } catch (error) {
      console.error("Failed to parse parent from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Mock API call to check parent credentials
    return new Promise(resolve => {
      setTimeout(() => {
        const foundParent = mockParents.find(p => p.username.toLowerCase() === username.toLowerCase());
        
        if (foundParent && pass === 'password') { // Using a simple password for mock
          const associatedStudent = mockStudents.find(s => s.id === foundParent.studentId);
          setParent(foundParent);
          if (associatedStudent) {
              setStudent(associatedStudent);
          }
          sessionStorage.setItem('min-parent', JSON.stringify(foundParent));
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
    setParent(null);
    setStudent(null);
    sessionStorage.removeItem('min-parent');
    // Navigate to login page - this should be handled by the component using the hook
  };

  const value = { parent, student, loading, login, logout };

  return (
    <ParentAuthContext.Provider value={value}>
      {children}
    </ParentAuthContext.Provider>
  );
};

export const useParentAuth = () => {
    const context = useContext(ParentAuthContext);
    if (!context) {
        throw new Error('useParentAuth must be used within a ParentAuthProvider');
    }
    return context;
};