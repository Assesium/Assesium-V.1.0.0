import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventType = 
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'assessment_start'
  | 'assessment_complete'
  | 'assessment_submit'
  | 'file_upload'
  | 'file_download'
  | 'search'
  | 'filter'
  | 'sort'
  | 'navigation'
  | 'error'
  | 'performance';

export type MetricType = 
  | 'load_time'
  | 'response_time'
  | 'memory_usage'
  | 'cpu_usage'
  | 'network_latency'
  | 'error_rate'
  | 'user_engagement'
  | 'feature_usage';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: string;
  userId?: string;
  institutionId?: string;
  sessionId: string;
  metadata: Record<string, any>;
  path: string;
  referrer?: string;
  userAgent: string;
  deviceInfo: {
    type: string;
    platform: string;
    browser: string;
    screenResolution: string;
    language: string;
  };
}

export interface PerformanceMetric {
  id: string;
  type: MetricType;
  timestamp: string;
  value: number;
  unit: string;
  metadata: Record<string, any>;
  userId?: string;
  institutionId?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  institutionId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  deviceInfo: {
    type: string;
    platform: string;
    browser: string;
    screenResolution: string;
    language: string;
  };
  pages: string[];
  events: string[];
  metrics: string[];
}

interface AnalyticsStore {
  events: AnalyticsEvent[];
  metrics: PerformanceMetric[];
  sessions: UserSession[];
  currentSession: UserSession | null;
  addEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => void;
  addMetric: (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => void;
  startSession: (session: Omit<UserSession, 'id' | 'startTime'>) => void;
  endSession: (sessionId: string) => void;
  clearData: () => void;
  getEventsByType: (type: EventType) => AnalyticsEvent[];
  getMetricsByType: (type: MetricType) => PerformanceMetric[];
  getSessionStats: (sessionId: string) => {
    duration: number;
    pageCount: number;
    eventCount: number;
    metricCount: number;
    averageLoadTime: number;
    averageResponseTime: number;
    errorCount: number;
  };
  getAnalyticsSummary: () => {
    totalEvents: number;
    totalSessions: number;
    activeSessions: number;
    averageSessionDuration: number;
    eventsByType: Record<EventType, number>;
    metricsByType: Record<MetricType, number>;
    topPages: { path: string; count: number }[];
    topEvents: { type: EventType; count: number }[];
  };
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      events: [],
      metrics: [],
      sessions: [],
      currentSession: null,

      addEvent: (event) => {
        const newEvent: AnalyticsEvent = {
          ...event,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                events: [...state.currentSession.events, newEvent.id],
              }
            : null,
        }));
      },

      addMetric: (metric) => {
        const newMetric: PerformanceMetric = {
          ...metric,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          metrics: [...state.metrics, newMetric],
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                metrics: [...state.currentSession.metrics, newMetric.id],
              }
            : null,
        }));
      },

      startSession: (session) => {
        const newSession: UserSession = {
          ...session,
          id: crypto.randomUUID(),
          startTime: new Date().toISOString(),
          pages: [],
          events: [],
          metrics: [],
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
        }));
      },

      endSession: (sessionId) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;

          const endTime = new Date().toISOString();
          const duration =
            new Date(endTime).getTime() - new Date(session.startTime).getTime();

          const updatedSession = {
            ...session,
            endTime,
            duration,
          };

          return {
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? updatedSession : s
            ),
            currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
          };
        });
      },

      clearData: () => {
        set({
          events: [],
          metrics: [],
          sessions: [],
          currentSession: null,
        });
      },

      getEventsByType: (type) => {
        return get().events.filter((e) => e.type === type);
      },

      getMetricsByType: (type) => {
        return get().metrics.filter((m) => m.type === type);
      },

      getSessionStats: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) {
          return {
            duration: 0,
            pageCount: 0,
            eventCount: 0,
            metricCount: 0,
            averageLoadTime: 0,
            averageResponseTime: 0,
            errorCount: 0,
          };
        }

        const events = get().events.filter((e) => session.events.includes(e.id));
        const metrics = get().metrics.filter((m) => session.metrics.includes(m.id));

        const loadTimes = metrics
          .filter((m) => m.type === 'load_time')
          .map((m) => m.value);
        const responseTimes = metrics
          .filter((m) => m.type === 'response_time')
          .map((m) => m.value);
        const errors = events.filter((e) => e.type === 'error');

        return {
          duration: session.duration || 0,
          pageCount: session.pages.length,
          eventCount: session.events.length,
          metricCount: session.metrics.length,
          averageLoadTime:
            loadTimes.reduce((acc, val) => acc + val, 0) / loadTimes.length || 0,
          averageResponseTime:
            responseTimes.reduce((acc, val) => acc + val, 0) / responseTimes.length || 0,
          errorCount: errors.length,
        };
      },

      getAnalyticsSummary: () => {
        const events = get().events;
        const metrics = get().metrics;
        const sessions = get().sessions;

        const eventsByType = events.reduce(
          (acc, e) => ({
            ...acc,
            [e.type]: (acc[e.type] || 0) + 1,
          }),
          {} as Record<EventType, number>
        );

        const metricsByType = metrics.reduce(
          (acc, m) => ({
            ...acc,
            [m.type]: (acc[m.type] || 0) + 1,
          }),
          {} as Record<MetricType, number>
        );

        const pagesByCount = events.reduce(
          (acc, e) => ({
            ...acc,
            [e.path]: (acc[e.path] || 0) + 1,
          }),
          {} as Record<string, number>
        );

        const topPages = Object.entries(pagesByCount)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const topEvents = Object.entries(eventsByType)
          .map(([type, count]) => ({ type: type as EventType, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const activeSessions = sessions.filter((s) => !s.endTime).length;
        const completedSessions = sessions.filter((s) => s.endTime);
        const averageSessionDuration =
          completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0) /
          completedSessions.length || 0;

        return {
          totalEvents: events.length,
          totalSessions: sessions.length,
          activeSessions,
          averageSessionDuration,
          eventsByType,
          metricsByType,
          topPages,
          topEvents,
        };
      },
    }),
    {
      name: 'analytics-storage',
    }
  )
); 