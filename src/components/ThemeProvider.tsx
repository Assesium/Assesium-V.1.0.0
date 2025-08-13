import { ReactNode, useEffect, useState } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { useUIStore } from '../stores/useUIStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { preferences, updatePreferences } = useUIStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize theme on mount
  useEffect(() => {
    try {
      // Check for stored theme preference
      const storedTheme = localStorage.getItem('theme-storage');
      const storedPreferences = localStorage.getItem('ui-preferences');
      
      // Parse stored values with default values
      const parsedTheme = storedTheme ? JSON.parse(storedTheme) : { state: { isDarkMode: false } };
      const parsedPreferences = storedPreferences ? JSON.parse(storedPreferences) : { state: { colorScheme: 'system' } };
      
      // Initialize theme based on stored values or system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = parsedPreferences?.state?.colorScheme === 'dark' || 
                           (parsedPreferences?.state?.colorScheme === 'system' && systemPrefersDark) ||
                           parsedTheme?.state?.isDarkMode;
      
      // Apply theme
      applyTheme(shouldUseDark);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark);
      setIsInitialized(true);
    }
  }, []);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (preferences?.colorScheme === 'system') {
        applyTheme(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences?.colorScheme]);

  // Watch for theme store changes
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = preferences?.colorScheme === 'dark' || 
                         (preferences?.colorScheme === 'system' && systemPrefersDark) ||
                         isDarkMode;
    
    applyTheme(shouldUseDark);
  }, [preferences?.colorScheme, isDarkMode]);

  const applyTheme = (isDark: boolean) => {
    document.documentElement.classList.toggle('dark', isDark);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading theme...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}