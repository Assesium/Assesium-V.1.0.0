import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorSource = 'api' | 'validation' | 'auth' | 'file' | 'system' | 'other';

export interface ErrorState {
  id: string;
  message: string;
  severity: ErrorSeverity;
  source: ErrorSource;
  timestamp: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface LoadingState {
  id: string;
  action: string;
  component: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ErrorStore {
  errors: ErrorState[];
  loadingStates: LoadingState[];
  addError: (error: Omit<ErrorState, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveError: (id: string, resolvedBy: string) => void;
  clearErrors: () => void;
  addLoadingState: (state: Omit<LoadingState, 'id' | 'timestamp'>) => void;
  removeLoadingState: (id: string) => void;
  clearLoadingStates: () => void;
  getActiveErrors: () => ErrorState[];
  getLoadingStates: (component?: string) => LoadingState[];
  getErrorStats: () => {
    total: number;
    active: number;
    bySeverity: Record<ErrorSeverity, number>;
    bySource: Record<ErrorSource, number>;
  };
}

export const useErrorStore = create<ErrorStore>()(
  persist(
    (set, get) => ({
      errors: [],
      loadingStates: [],

      addError: (error) => {
        const newError: ErrorState = {
          ...error,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          resolved: false,
        };
        set((state) => ({
          errors: [...state.errors, newError],
        }));
      },

      resolveError: (id, resolvedBy) => {
        set((state) => ({
          errors: state.errors.map((e) =>
            e.id === id
              ? {
                  ...e,
                  resolved: true,
                  resolvedAt: new Date().toISOString(),
                  resolvedBy,
                }
              : e
          ),
        }));
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      addLoadingState: (state) => {
        const newState: LoadingState = {
          ...state,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          loadingStates: [...state.loadingStates, newState],
        }));
      },

      removeLoadingState: (id) => {
        set((state) => ({
          loadingStates: state.loadingStates.filter((s) => s.id !== id),
        }));
      },

      clearLoadingStates: () => {
        set({ loadingStates: [] });
      },

      getActiveErrors: () => {
        return get().errors.filter((e) => !e.resolved);
      },

      getLoadingStates: (component) => {
        return get().loadingStates.filter(
          (s) => !component || s.component === component
        );
      },

      getErrorStats: () => {
        const errors = get().errors;
        const activeErrors = errors.filter((e) => !e.resolved);

        const bySeverity = errors.reduce(
          (acc, e) => ({
            ...acc,
            [e.severity]: (acc[e.severity] || 0) + 1,
          }),
          {} as Record<ErrorSeverity, number>
        );

        const bySource = errors.reduce(
          (acc, e) => ({
            ...acc,
            [e.source]: (acc[e.source] || 0) + 1,
          }),
          {} as Record<ErrorSource, number>
        );

        return {
          total: errors.length,
          active: activeErrors.length,
          bySeverity,
          bySource,
        };
      },
    }),
    {
      name: 'error-storage',
    }
  )
); 