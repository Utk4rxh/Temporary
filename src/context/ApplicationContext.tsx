// src/context/ApplicationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Application, ScholarshipFund, AuditLogEntry } from '../types';
import { ScholarshipService } from '../services/scholarshipService';

interface ApplicationContextType {
  applications: Application[];
  funds: ScholarshipFund[];
  auditLogs: AuditLogEntry[];
  loading: boolean;
  refreshData: () => Promise<void>;
  overrideApplication: (id: string, status: 'approved' | 'rejected', amount: number, reason: string, adminName: string) => Promise<void>;
  addApplication: (app: Omit<Application, 'id' | 'submissionDate' | 'status' | 'isOverridden'>) => Promise<Application>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [funds, setFunds] = useState<ScholarshipFund[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appData, fundData, logData] = await Promise.all([
        ScholarshipService.getApplications(),
        ScholarshipService.getScholarshipFunds(),
        ScholarshipService.getAuditLogs(),
      ]);
      setApplications(appData);
      setFunds(fundData);
      setAuditLogs(logData);
    } catch (err) {
      console.error('Error loading scholarship data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overrideApplication = async (
    id: string,
    status: 'approved' | 'rejected',
    amount: number,
    reason: string,
    adminName: string
  ) => {
    await ScholarshipService.overrideApplication(id, status, amount, reason, adminName);
    await loadData();
  };

  const addApplication = async (newApp: Omit<Application, 'id' | 'submissionDate' | 'status' | 'isOverridden'>) => {
    const created = await ScholarshipService.createApplication(newApp);
    await loadData();
    return created;
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        funds,
        auditLogs,
        loading,
        refreshData: loadData,
        overrideApplication,
        addApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('useApplications must be used within an ApplicationProvider');
  return context;
};
