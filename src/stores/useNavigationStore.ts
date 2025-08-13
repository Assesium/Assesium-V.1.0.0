import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Breadcrumb {
  label: string;
  path: string;
  icon?: string;
}

export interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  breadcrumbs: Breadcrumb[];
  navigationHistory: string[];
  maxHistoryLength: number;
}

interface NavigationStore {
  state: NavigationState;
  setCurrentPath: (path: string) => void;
  updateBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addToHistory: (path: string) => void;
  goBack: () => string | null;
  goForward: () => string | null;
  clearHistory: () => void;
  resetNavigation: () => void;
}

const initialState: NavigationState = {
  currentPath: '/',
  previousPath: null,
  breadcrumbs: [],
  navigationHistory: [],
  maxHistoryLength: 50,
};

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      state: initialState,

      setCurrentPath: (path) => {
        set((state) => ({
          state: {
            ...state.state,
            previousPath: state.state.currentPath,
            currentPath: path,
          },
        }));
      },

      updateBreadcrumbs: (breadcrumbs) => {
        set((state) => ({
          state: {
            ...state.state,
            breadcrumbs,
          },
        }));
      },

      addToHistory: (path) => {
        set((state) => {
          const newHistory = [...state.state.navigationHistory];
          if (newHistory[newHistory.length - 1] !== path) {
            newHistory.push(path);
            if (newHistory.length > state.state.maxHistoryLength) {
              newHistory.shift();
            }
          }
          return {
            state: {
              ...state.state,
              navigationHistory: newHistory,
            },
          };
        });
      },

      goBack: () => {
        const { navigationHistory, currentPath } = get().state;
        const currentIndex = navigationHistory.indexOf(currentPath);
        if (currentIndex > 0) {
          const previousPath = navigationHistory[currentIndex - 1];
          set((state) => ({
            state: {
              ...state.state,
              previousPath: state.state.currentPath,
              currentPath: previousPath,
            },
          }));
          return previousPath;
        }
        return null;
      },

      goForward: () => {
        const { navigationHistory, currentPath } = get().state;
        const currentIndex = navigationHistory.indexOf(currentPath);
        if (currentIndex < navigationHistory.length - 1) {
          const nextPath = navigationHistory[currentIndex + 1];
          set((state) => ({
            state: {
              ...state.state,
              previousPath: state.state.currentPath,
              currentPath: nextPath,
            },
          }));
          return nextPath;
        }
        return null;
      },

      clearHistory: () => {
        set((state) => ({
          state: {
            ...state.state,
            navigationHistory: [],
          },
        }));
      },

      resetNavigation: () => {
        set({ state: initialState });
      },
    }),
    {
      name: 'navigation-storage',
    }
  )
); 