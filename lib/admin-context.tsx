'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  role: string | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/verify-admin');
      
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        setRole(data.role);
        setUserId(data.userId);
        setEmail(data.email);
      } else {
        setIsAdmin(false);
        setRole(null);
        setUserId(null);
        setEmail(null);
      }
    } catch (error) {
      console.error('[Admin Context Error]', error);
      setIsAdmin(false);
      setRole(null);
      setUserId(null);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, role, userId, email, loading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
