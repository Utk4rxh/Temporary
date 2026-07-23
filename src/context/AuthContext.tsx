// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '../types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userEmail: string;
  userAvatar: string;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');

  useEffect(() => {
    const saved = localStorage.getItem('user_role') as UserRole;
    if (saved) setRoleState(saved);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('user_role', newRole);
  };

  const switchRole = () => {
    const nextRole = role === 'student' ? 'admin' : 'student';
    setRole(nextRole);
  };

  const userInfo =
    role === 'student'
      ? {
          userName: 'Aria Chen',
          userEmail: 'aria.chen@university.edu',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        }
      : {
          userName: 'Dr. Elena Rostova',
          userEmail: 'elena.rostova@scholarships.org',
          userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        switchRole,
        ...userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
