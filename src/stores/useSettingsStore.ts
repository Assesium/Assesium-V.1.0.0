import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

export interface UserPreferences {
  theme: Theme;
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    assessmentUpdates: boolean;
    gradeUpdates: boolean;
    announcements: boolean;
    messages: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    showProfile: boolean;
    showProgress: boolean;
    showGrades: boolean;
    allowAnalytics: boolean;
  };
}

export interface InstitutionSettings {
  id: string;
  institutionId: string;
  features: {
    aiMarking: boolean;
    customMarking: boolean;
    parentAccess: boolean;
    studentAccess: boolean;
    attendance: boolean;
    messaging: boolean;
    announcements: boolean;
    reports: boolean;
    analytics: boolean;
  };
  branding: {
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
  };
  assessment: {
    defaultMarkingScheme?: string;
    allowRetakes: boolean;
    maxRetakes: number;
    timeLimit: number;
    showResults: boolean;
    showFeedback: boolean;
    showSolutions: boolean;
  };
  communication: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    defaultLanguage: Language;
  };
  security: {
    require2FA: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  integrations: {
    lms?: {
      enabled: boolean;
      type: string;
      url: string;
      apiKey: string;
    };
    calendar?: {
      enabled: boolean;
      type: string;
      credentials: Record<string, any>;
    };
    payment?: {
      enabled: boolean;
      providers: string[];
      defaultProvider: string;
    };
  };
}

interface SettingsState {
  userPreferences: UserPreferences;
  institutionSettings: Record<string, InstitutionSettings>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateInstitutionSettings: (institutionId: string, settings: Partial<InstitutionSettings>) => void;
  getInstitutionSettings: (institutionId: string) => InstitutionSettings | undefined;
  resetUserPreferences: () => void;
  resetInstitutionSettings: (institutionId: string) => void;
}

const defaultUserPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    email: true,
    push: true,
    desktop: true,
    assessmentUpdates: true,
    gradeUpdates: true,
    announcements: true,
    messages: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    screenReader: false,
    reducedMotion: false,
  },
  privacy: {
    showProfile: true,
    showProgress: true,
    showGrades: true,
    allowAnalytics: true,
  },
};

const defaultInstitutionSettings: Omit<InstitutionSettings, 'id' | 'institutionId'> = {
  features: {
    aiMarking: true,
    customMarking: true,
    parentAccess: true,
    studentAccess: true,
    attendance: true,
    messaging: true,
    announcements: true,
    reports: true,
    analytics: true,
  },
  branding: {
    colors: {
      primary: '#4F46E5',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Roboto',
    },
  },
  assessment: {
    allowRetakes: true,
    maxRetakes: 3,
    timeLimit: 120,
    showResults: true,
    showFeedback: true,
    showSolutions: false,
  },
  communication: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    defaultLanguage: 'en',
  },
  security: {
    require2FA: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },
  integrations: {},
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      userPreferences: defaultUserPreferences,
      institutionSettings: {},

      updateUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        }));
      },

      updateInstitutionSettings: (institutionId, settings) => {
        set((state) => ({
          institutionSettings: {
            ...state.institutionSettings,
            [institutionId]: {
              ...state.institutionSettings[institutionId],
              ...settings,
            },
          },
        }));
      },

      getInstitutionSettings: (institutionId) => {
        return get().institutionSettings[institutionId];
      },

      resetUserPreferences: () => {
        set({ userPreferences: defaultUserPreferences });
      },

      resetInstitutionSettings: (institutionId) => {
        set((state) => {
          const { [institutionId]: _, ...rest } = state.institutionSettings;
          return { institutionSettings: rest };
        });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
); 