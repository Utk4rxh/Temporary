// src/services/scholarshipService.ts
import type { Application, ScholarshipFund, AuditLogEntry } from '../types';
import { INITIAL_APPLICATIONS, INITIAL_SCHOLARSHIP_FUNDS, MOCK_AUDIT_LOGS } from '../data/mockData';

// Simulated API latency helper
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export class ScholarshipService {
  static async getApplications(): Promise<Application[]> {
    await delay();
    const stored = localStorage.getItem('scholarship_applications');
    return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
  }

  static async getApplicationById(id: string): Promise<Application | undefined> {
    const apps = await this.getApplications();
    return apps.find((app) => app.id === id);
  }

  static async getScholarshipFunds(): Promise<ScholarshipFund[]> {
    await delay();
    const stored = localStorage.getItem('scholarship_funds');
    return stored ? JSON.parse(stored) : INITIAL_SCHOLARSHIP_FUNDS;
  }

  static async overrideApplication(
    id: string,
    newStatus: 'approved' | 'rejected',
    newAmount: number,
    reason: string,
    adminName: string
  ): Promise<Application> {
    const apps = await this.getApplications();
    const index = apps.findIndex((a) => a.id === id);

    if (index === -1) throw new Error('Application not found');

    const app = apps[index];
    const updatedApp: Application = {
      ...app,
      status: 'overridden',
      awardedAmount: newStatus === 'approved' ? newAmount : 0,
      isOverridden: true,
      overrideReason: reason,
      overriddenBy: adminName,
      overriddenAt: new Date().toISOString(),
    };

    apps[index] = updatedApp;
    localStorage.setItem('scholarship_applications', JSON.stringify(apps));

    // Append to audit logs
    const auditLogs = await this.getAuditLogs();
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: adminName,
      actorRole: 'admin',
      action: 'MANUAL_OVERRIDE',
      applicationId: app.id,
      applicantName: app.student.fullName,
      previousValue: `${app.status} ($${app.awardedAmount || 0})`,
      newValue: `${newStatus} ($${newAmount})`,
      justification: reason,
      ipAddress: '192.168.1.100',
    };
    localStorage.setItem('scholarship_audit_logs', JSON.stringify([newLog, ...auditLogs]));

    return updatedApp;
  }

  static async createApplication(newApp: Omit<Application, 'id' | 'submissionDate' | 'status' | 'isOverridden'>): Promise<Application> {
    const apps = await this.getApplications();
    const fullApp: Application = {
      ...newApp,
      id: `app-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'ai_evaluated',
      isOverridden: false,
    };

    const updated = [fullApp, ...apps];
    localStorage.setItem('scholarship_applications', JSON.stringify(updated));
    return fullApp;
  }

  static async getAuditLogs(): Promise<AuditLogEntry[]> {
    await delay(150);
    const stored = localStorage.getItem('scholarship_audit_logs');
    return stored ? JSON.parse(stored) : MOCK_AUDIT_LOGS;
  }
}
