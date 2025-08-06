import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorScheme = 'light' | 'dark' | 'system';
export type LayoutMode = 'default' | 'compact' | 'comfortable';
export type FontSize = 'small' | 'medium' | 'large';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface UIPreferences {
  colorScheme: ColorScheme;
  layoutMode: LayoutMode;
  fontSize: FontSize;
  animationSpeed: AnimationSpeed;
  reducedMotion: boolean;
  highContrast: boolean;
  showAnimations: boolean;
  showTooltips: boolean;
  showNotifications: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  headerHeight: number;
  footerHeight: number;
}

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

interface UIStore {
  preferences: UIPreferences;
  responsive: ResponsiveState;
  theme: ThemeColors;
  updatePreferences: (preferences: Partial<UIPreferences>) => void;
  updateResponsiveState: (state: Partial<ResponsiveState>) => void;
  updateTheme: (theme: Partial<ThemeColors>) => void;
  resetPreferences: () => void;
  toggleSidebar: () => void;
  toggleColorScheme: () => void;
  toggleLayoutMode: () => void;
  toggleFontSize: () => void;
  toggleAnimationSpeed: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleShowAnimations: () => void;
  toggleShowTooltips: () => void;
  toggleShowNotifications: () => void;
}

const defaultPreferences: UIPreferences = {
  colorScheme: 'system',
  layoutMode: 'default',
  fontSize: 'medium',
  animationSpeed: 'normal',
  reducedMotion: false,
  highContrast: false,
  showAnimations: true,
  showTooltips: true,
  showNotifications: true,
  sidebarCollapsed: false,
  sidebarWidth: 280,
  headerHeight: 64,
  footerHeight: 48
};

const defaultTheme: ThemeColors = {
  primary: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};

const defaultResponsive: ResponsiveState = {
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  screenWidth: 0,
  screenHeight: 0,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      responsive: defaultResponsive,
      theme: defaultTheme,

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        }));
      },

      updateResponsiveState: (state) => {
        set((currentState) => ({
          responsive: {
            ...currentState.responsive,
            ...state,
          },
        }));
      },

      updateTheme: (theme) => {
        set((state) => ({
          theme: {
            ...state.theme,
            ...theme,
          },
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      toggleSidebar: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: !state.preferences.sidebarCollapsed,
          },
        }));
      },

      toggleColorScheme: () => {
        set((state) => {
          const schemes: ColorScheme[] = ['light', 'dark', 'system'];
          const currentIndex = schemes.indexOf(state.preferences.colorScheme);
          const nextIndex = (currentIndex + 1) % schemes.length;
          return {
            preferences: {
              ...state.preferences,
              colorScheme: schemes[nextIndex],
            },
          };
        });
      },

      toggleLayoutMode: () => {
        set((state) => {
          const modes: LayoutMode[] = ['default', 'compact', 'comfortable'];
          const currentIndex = modes.indexOf(state.preferences.layoutMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          return {
            preferences: {
              ...state.preferences,
              layoutMode: modes[nextIndex],
            },
          };
        });
      },

      toggleFontSize: () => {
        set((state) => {
          const sizes: FontSize[] = ['small', 'medium', 'large'];
          const currentIndex = sizes.indexOf(state.preferences.fontSize);
          const nextIndex = (currentIndex + 1) % sizes.length;
          return {
            preferences: {
              ...state.preferences,
              fontSize: sizes[nextIndex],
            },
          };
        });
      },

      toggleAnimationSpeed: () => {
        set((state) => {
          const speeds: AnimationSpeed[] = ['slow', 'normal', 'fast'];
          const currentIndex = speeds.indexOf(state.preferences.animationSpeed);
          const nextIndex = (currentIndex + 1) % speeds.length;
          return {
            preferences: {
              ...state.preferences,
              animationSpeed: speeds[nextIndex],
            },
          };
        });
      },

      toggleReducedMotion: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            reducedMotion: !state.preferences.reducedMotion,
          },
        }));
      },

      toggleHighContrast: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            highContrast: !state.preferences.highContrast,
          },
        }));
      },

      toggleShowAnimations: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            showAnimations: !state.preferences.showAnimations,
          },
        }));
      },

      toggleShowTooltips: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            showTooltips: !state.preferences.showTooltips,
          },
        }));
      },

      toggleShowNotifications: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            showNotifications: !state.preferences.showNotifications,
          },
        }));
      },
    }),
    {
      name: 'ui-storage',
    }
  )
); 