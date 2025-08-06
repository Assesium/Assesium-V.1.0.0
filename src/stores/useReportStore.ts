import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReportType = 
  | 'student_performance'
  | 'class_performance'
  | 'subject_performance'
  | 'institution_performance'
  | 'progress_report'
  | 'attendance_report'
  | 'assessment_report'
  | 'analytics_report';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  format: ReportFormat;
  data: Record<string, any>;
  filters: Record<string, any>;
  generatedBy: string;
  institutionId: string;
  classId?: string;
  subjectId?: string;
  studentId?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AnalyticsData {
  id: string;
  type: string;
  title: string;
  description: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean;
    }[];
  };
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins?: {
      legend?: {
        position: 'top' | 'bottom' | 'left' | 'right';
      };
      title?: {
        display: boolean;
        text: string;
      };
    };
    scales?: {
      y?: {
        beginAtZero: boolean;
        title?: {
          display: boolean;
          text: string;
        };
      };
      x?: {
        title?: {
          display: boolean;
          text: string;
        };
      };
    };
  };
  institutionId: string;
  classId?: string;
  subjectId?: string;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportState {
  reports: Report[];
  analytics: AnalyticsData[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  addAnalytics: (analytics: Omit<AnalyticsData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnalytics: (id: string, analytics: Partial<AnalyticsData>) => void;
  deleteAnalytics: (id: string) => void;
  getReportsByType: (type: ReportType, institutionId: string) => Report[];
  getReportsByDateRange: (startDate: string, endDate: string, institutionId: string) => Report[];
  getAnalyticsByType: (type: string, institutionId: string) => AnalyticsData[];
  getReportStats: (institutionId: string) => {
    total: number;
    byType: Record<ReportType, number>;
    byFormat: Record<ReportFormat, number>;
    recentReports: Report[];
  };
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      analytics: [],

      addReport: (report) => {
        const newReport = {
          ...report,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reports: [...state.reports, newReport],
        }));
      },

      updateReport: (id, report) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, ...report } : r
          ),
        }));
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        }));
      },

      addAnalytics: (analytics) => {
        const newAnalytics = {
          ...analytics,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          analytics: [...state.analytics, newAnalytics],
        }));
      },

      updateAnalytics: (id, analytics) => {
        set((state) => ({
          analytics: state.analytics.map((a) =>
            a.id === id
              ? { ...a, ...analytics, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      deleteAnalytics: (id) => {
        set((state) => ({
          analytics: state.analytics.filter((a) => a.id !== id),
        }));
      },

      getReportsByType: (type, institutionId) => {
        return get().reports.filter(
          (r) => r.type === type && r.institutionId === institutionId
        );
      },

      getReportsByDateRange: (startDate, endDate, institutionId) => {
        return get().reports.filter(
          (r) =>
            r.institutionId === institutionId &&
            r.startDate >= startDate &&
            r.endDate <= endDate
        );
      },

      getAnalyticsByType: (type, institutionId) => {
        return get().analytics.filter(
          (a) => a.type === type && a.institutionId === institutionId
        );
      },

      getReportStats: (institutionId) => {
        const institutionReports = get().reports.filter(
          (r) => r.institutionId === institutionId
        );

        const byType = institutionReports.reduce(
          (acc, r) => ({
            ...acc,
            [r.type]: (acc[r.type] || 0) + 1,
          }),
          {} as Record<ReportType, number>
        );

        const byFormat = institutionReports.reduce(
          (acc, r) => ({
            ...acc,
            [r.format]: (acc[r.format] || 0) + 1,
          }),
          {} as Record<ReportFormat, number>
        );

        const recentReports = institutionReports
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        return {
          total: institutionReports.length,
          byType,
          byFormat,
          recentReports,
        };
      },
    }),
    {
      name: 'report-storage',
    }
  )
); 