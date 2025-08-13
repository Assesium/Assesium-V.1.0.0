import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme to document immediately
  useEffect(() => {
    if (mounted) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, mounted]);

  // Handle theme toggle - simple toggle between dark and light
  const handleToggleTheme = () => {
    toggleTheme();
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-110"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-all duration-300 rotate-0 hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-200 transition-all duration-300 rotate-0 hover:-rotate-180" />
      )}
    </button>
  );
}

